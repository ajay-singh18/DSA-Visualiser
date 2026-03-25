import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Question } from '../models/Question.js';
import { AssessmentSession } from '../models/AssessmentSession.js';
import User from '../models/User.js';

export const startAssessment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, questionCount } = req.body;
    let { timeLimitMinutes } = req.body;
    
    if (!category || !questionCount) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Fetch random questions matching category
    const questions = await Question.aggregate([
      { $match: { category } },
      { $sample: { size: questionCount } }
    ]);

    if (questions.length === 0) {
      res.status(404).json({ error: 'No questions found for this category' });
      return;
    }

    const questionIds = questions.map(q => q._id);

    // Calculate total time limit if not provided by client (which we'll prefer in Setup UI)
    // Each question has its own timeLimitSeconds (easy=30s, med=60s, hard=90s)
    if (!timeLimitMinutes) {
      const totalSeconds = questions.reduce((acc, current) => acc + (current.timeLimitSeconds || 60), 0);
      timeLimitMinutes = Math.max(1, Math.ceil(totalSeconds / 60));
    }

    // Create session
    const session = await AssessmentSession.create({
      userId: req.userId,
      category,
      questionIds,
      timeLimitMinutes,
      startedAt: new Date()
    });

    // Remove correct answers before sending to client
    const sanitizedQuestions = questions.map(q => {
      const { correctAnswer, _id, __v, ...rest } = q;
      // timeLimitSeconds is public (auto-derived from difficulty) — safe to send
      return { id: _id.toString(), ...rest };
    });

    res.json({
      sessionId: session._id,
      questions: sanitizedQuestions,
      timeLimitMinutes,
      startedAt: session.startedAt
    });
  } catch (error) {
    console.error('Start assessment error:', error);
    res.status(500).json({ error: 'Failed to start assessment' });
  }
};

export const submitAssessment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId, answers } = req.body; // answers is { questionId: string, answer: string }[]

    if (!sessionId || !answers) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const session = await AssessmentSession.findOne({ _id: sessionId, userId: req.userId });
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    if (session.submittedAt) {
      res.status(400).json({ error: 'Assessment already submitted' });
      return;
    }

    const now = new Date();
    const timeTakenMs = now.getTime() - session.startedAt.getTime();
    const timeTakenSeconds = Math.floor(timeTakenMs / 1000);
    
    // Validate time bounds (with 5 sec network grace period)
    const maxTimeMs = (session.timeLimitMinutes * 60 * 1000) + 5000;
    if (timeTakenMs > maxTimeMs) {
      // Still accept it but mark everything wrong or penalize
      console.warn(`User ${req.userId} exceeded time limit for session ${sessionId}`);
    }

    // Fetch the actual questions to verify answers
    const questions = await Question.find({ _id: { $in: session.questionIds } });
    const questionMap = new Map();
    questions.forEach(q => questionMap.set(q._id.toString(), q));

    let correctCount = 0;
    const results = [];
    const dbAnswersFormat: Record<string, string> = {};

    // Build a lookup from submitted answers
    const answerLookup: Record<string, string> = {};
    for (const item of answers) {
      answerLookup[item.questionId] = item.answer;
    }

    // Iterate ALL session questions so unanswered ones appear in results too
    for (const qId of session.questionIds) {
      const q = questionMap.get(qId.toString());
      if (!q) continue;

      const userAnswer = answerLookup[qId.toString()] || '';
      dbAnswersFormat[qId.toString()] = userAnswer;

      // Normalize predict-state answers: strip spaces, compare case-insensitive
      let isCorrect: boolean;
      if (q.type === 'predict-state') {
        const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();
        isCorrect = normalize(q.correctAnswer) === normalize(userAnswer);
      } else {
        isCorrect = q.correctAnswer === userAnswer;
      }
      if (isCorrect) correctCount++;

      results.push({
        questionId: q._id.toString(),
        question: {
          id: q._id.toString(),
          category: q.category,
          type: q.type,
          difficulty: q.difficulty,
          title: q.title,
          description: q.description,
          options: q.options,
          codeSnippet: q.codeSnippet,
          codeLanguage: q.codeLanguage
        },
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect
      });
    }

    // Update session
    session.submittedAt = now;
    session.answers = dbAnswersFormat;
    session.score = correctCount;
    session.total = session.questionIds.length;
    session.markModified('answers');
    await session.save();

    // ── Update user profile stats ──
    if (req.userId) {
      try {
        const user = await User.findById(req.userId);
        if (user) {
          const total = session.questionIds.length;
          const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

          // Increment testsPassed
          user.profileStats.testsPassed = (user.profileStats.testsPassed || 0) + 1;

          // Recalculate accuracy as rolling average across all quiz totals
          const allSessions = await AssessmentSession.find({
            userId: req.userId,
            submittedAt: { $exists: true }
          });
          const totalCorrect = allSessions.reduce((sum, s) => sum + (s.score || 0), 0);
          const totalQs = allSessions.reduce((sum, s) => sum + (s.total || 0), 0);
          user.profileStats.accuracy = totalQs > 0 ? Math.round((totalCorrect / totalQs) * 100) : 0;

          // Update categoryProgress
          const catName = session.category;
          const catColors: Record<string, string> = {
            sorting: '#6366f1',
            graphs: '#22d3ee',
            trees: '#34d399',
            searching: '#f59e0b',
            'dynamic-programming': '#a78bfa',
            backtracking: '#fb7185',
          };
          const existingCat = user.categoryProgress.find(c => c.name === catName);
          if (existingCat) {
            existingCat.completed += correctCount;
            existingCat.total += total;
          } else {
            user.categoryProgress.push({
              name: catName,
              completed: correctCount,
              total,
              color: catColors[catName] || '#6366f1',
            });
          }

          // Add activity entry
          user.activity.push({
            icon: '📝',
            text: `Completed ${catName} quiz — ${correctCount}/${total} (${percentage}%)`,
            date: now,
          });
          // Keep activity to last 30 entries
          if (user.activity.length > 30) {
            user.activity = user.activity.slice(-30);
          }

          // Check for streak update (if last activity was yesterday)
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const lastActivity = user.activity.length > 1
            ? user.activity[user.activity.length - 2]?.date
            : null;
          if (lastActivity) {
            const lastDate = new Date(lastActivity);
            const isSameDay = lastDate.toDateString() === now.toDateString();
            const isYesterday = lastDate.toDateString() === yesterday.toDateString();
            if (!isSameDay && isYesterday) {
              user.profileStats.currentStreak = (user.profileStats.currentStreak || 0) + 1;
            } else if (!isSameDay && !isYesterday) {
              user.profileStats.currentStreak = 1;
            }
          } else {
            user.profileStats.currentStreak = 1;
          }

          user.markModified('profileStats');
          user.markModified('categoryProgress');
          user.markModified('activity');
          await user.save();
        }
      } catch (statErr) {
        console.error('Failed to update user profile stats after quiz:', statErr);
      }
    }

    res.json({
      sessionId: session._id,
      score: correctCount,
      total: session.total,
      percentage: Math.round((correctCount / session.total) * 100),
      timeTakenSeconds,
      results
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({ error: 'Failed to submit assessment' });
  }
};

export const getSessionResults = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const session = await AssessmentSession.findOne({ _id: sessionId, userId: req.userId });
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    if (!session.submittedAt) {
      res.status(400).json({ error: 'Session not yet submitted' });
      return;
    }

    const questions = await Question.find({ _id: { $in: session.questionIds } });
    const questionMap = new Map();
    questions.forEach(q => questionMap.set(q._id.toString(), q));

    const timeTakenSeconds = Math.floor(
      (session.submittedAt.getTime() - session.startedAt.getTime()) / 1000
    );

    const answersObj = (session.answers as Record<string, string>) || {};
    const results = [];
    for (const qId of session.questionIds) {
      const q = questionMap.get(qId.toString());
      if (!q) continue;
      const userAnswer = answersObj[qId.toString()] || '';
      let isCorrect: boolean;
      if (q.type === 'predict-state') {
        const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();
        isCorrect = normalize(q.correctAnswer) === normalize(userAnswer);
      } else {
        isCorrect = q.correctAnswer === userAnswer;
      }
      results.push({
        questionId: q._id.toString(),
        question: {
          id: q._id.toString(),
          category: q.category, type: q.type, difficulty: q.difficulty,
          title: q.title, description: q.description,
          options: q.options, codeSnippet: q.codeSnippet, codeLanguage: q.codeLanguage
        },
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect
      });
    }

    res.json({
      sessionId: session._id,
      score: session.score,
      total: session.total,
      percentage: session.total ? Math.round(((session.score || 0) / session.total) * 100) : 0,
      timeTakenSeconds,
      results
    });
  } catch (error) {
    console.error('Get session results error:', error);
    res.status(500).json({ error: 'Failed to retrieve results' });
  }
};

export const getAssessmentHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessions = await AssessmentSession.find({ 
      userId: req.userId,
      submittedAt: { $exists: true } 
    }).sort({ createdAt: -1 }).limit(20);

    res.json(sessions);
  } catch (error) {
    console.error('Get assessment history error:', error);
    res.status(500).json({ error: 'Failed to retrieve assessment history' });
  }
};

export const getAssessmentStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessions = await AssessmentSession.find({
      userId: req.userId,
      submittedAt: { $exists: true }
    });

    if (sessions.length === 0) {
      res.json({
        totalQuizzes: 0,
        averageScore: 0,
        bestCategory: null,
        categoryBreakdown: [],
        recentSessions: []
      });
      return;
    }

    // Category breakdown
    const catMap: Record<string, { total: number; correct: number; count: number }> = {};
    let totalCorrect = 0;
    let totalQuestions = 0;

    for (const s of sessions) {
      const cat = s.category;
      if (!catMap[cat]) catMap[cat] = { total: 0, correct: 0, count: 0 };
      catMap[cat].total += s.total || 0;
      catMap[cat].correct += s.score || 0;
      catMap[cat].count += 1;
      totalCorrect += s.score || 0;
      totalQuestions += s.total || 0;
    }

    const categoryBreakdown = Object.entries(catMap).map(([category, data]) => ({
      category,
      quizzesTaken: data.count,
      totalQuestions: data.total,
      correctAnswers: data.correct,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
    }));

    // Best category by accuracy
    const bestCat = categoryBreakdown.reduce((best, cur) =>
      cur.accuracy > (best?.accuracy || 0) ? cur : best, categoryBreakdown[0]);

    // Recent sessions (last 10)
    const recentSessions = sessions
      .sort((a, b) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime())
      .slice(0, 10)
      .map(s => ({
        id: s._id,
        category: s.category,
        score: s.score,
        total: s.total,
        percentage: s.total ? Math.round(((s.score || 0) / s.total) * 100) : 0,
        submittedAt: s.submittedAt
      }));

    res.json({
      totalQuizzes: sessions.length,
      averageScore: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      bestCategory: bestCat?.category || null,
      categoryBreakdown,
      recentSessions
    });
  } catch (error) {
    console.error('Get assessment stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve assessment stats' });
  }
};
