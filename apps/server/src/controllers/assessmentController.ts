import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Question } from '../models/Question.js';
import { AssessmentSession } from '../models/AssessmentSession.js';

export const startAssessment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, questionCount, timeLimitMinutes } = req.body;
    
    if (!category || !questionCount || !timeLimitMinutes) {
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
      const { correctAnswer, ...rest } = q;
      return { id: rest._id, ...rest };
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
    const dbAnswersFormat = new Map<string, string>();

    for (const item of answers) {
      const q = questionMap.get(item.questionId);
      if (!q) continue;

      dbAnswersFormat.set(item.questionId, item.answer);

      const isCorrect = q.correctAnswer === item.answer;
      if (isCorrect) correctCount++;

      // We send back the correct answers to the client ONLY now
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
        userAnswer: item.answer,
        correctAnswer: q.correctAnswer,
        isCorrect
      });
    }

    // Update session
    session.submittedAt = now;
    session.answers = dbAnswersFormat;
    session.score = correctCount;
    session.total = session.questionIds.length;
    await session.save();

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

export const getAssessmentHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessions = await AssessmentSession.find({ 
      userId: req.userId,
      submittedAt: { $exists: true } 
    }).sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('Get assessment history error:', error);
    res.status(500).json({ error: 'Failed to retrieve assessment history' });
  }
};
