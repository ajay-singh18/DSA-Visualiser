import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

function formatUserObject(user: any) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    bio: user.bio || '',
    github: user.github || '',
    linkedin: user.linkedin || '',
    leetcode: user.leetcode || '',
    createdAt: user.createdAt,
    profileStats: user.profileStats,
    badges: user.badges,
    activity: user.activity,
    raceHistory: user.raceHistory,
    categoryProgress: user.categoryProgress,
  };
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: 'username, email, and password are required' });
      return;
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      res.status(409).json({ error: 'User with this email or username already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, passwordHash });

    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user: formatUserObject(user),
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required' });
      return;
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: formatUserObject(user),
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login', details: error.message });
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({
      user: formatUserObject(user)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
}

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export async function googleLogin(req: Request, res: Response): Promise<void> {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400).json({ error: 'Google credential is required' });
      return;
    }

    // Verify token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ error: 'Invalid Google token payload' });
      return;
    }

    const { email, name } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    // If new user, create them (with a dummy password since they use Google)
    if (!user) {
      const dummyPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), 10);
      user = await User.create({
        username: name || email.split('@')[0], // fallback username
        email,
        passwordHash: dummyPassword
      });
    }

    // Sign JWT
    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: formatUserObject(user),
      token,
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { username, bio, github, linkedin, leetcode } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check username uniqueness if changed
    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) {
        res.status(409).json({ error: 'Username is already taken' });
        return;
      }
      user.username = username;
    }

    const updateData: any = {};
    if (bio !== undefined) updateData.bio = bio;
    if (github !== undefined) updateData.github = github;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (leetcode !== undefined) updateData.leetcode = leetcode;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: formatUserObject(updatedUser)
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

import { AuthRequest } from '../middleware/auth.js';

export async function recordRaceHistory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { algo1, algo2, winner, steps1, steps2 } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!algo1 || !algo2 || winner === undefined) {
      res.status(400).json({ error: 'algo1, algo2, and winner are required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isWin = winner === algo1;
    const winnerLabel = winner === 'tie' ? 'Tie' : winner;

    user.raceHistory.push({
      algo1,
      algo2,
      result: isWin ? 'win' : 'loss',
      date: new Date(),
    });
    // Keep last 20 races
    if (user.raceHistory.length > 20) {
      user.raceHistory = user.raceHistory.slice(-20);
    }

    user.activity.push({
      icon: '🏁',
      text: `Race: ${algo1} vs ${algo2} — 🏆 ${winnerLabel} won (${steps1 ?? '?'} vs ${steps2 ?? '?'} steps)`,
      date: new Date(),
    });
    if (user.activity.length > 30) {
      user.activity = user.activity.slice(-30);
    }

    user.markModified('raceHistory');
    user.markModified('activity');
    await user.save();

    res.json({ success: true, user: formatUserObject(user) });
  } catch (error) {
    console.error('Record race history error:', error);
    res.status(500).json({ error: 'Failed to record race history' });
  }
}

export async function recordAlgorithmRun(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { algorithmKey } = req.body;
    const userId = req.userId;

    if (!userId || !algorithmKey) {
      res.status(400).json({ error: 'Missing data' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.profileStats.algorithmsVisualized = (user.profileStats.algorithmsVisualized || 0) + 1;

    user.activity.push({
      icon: '⚡',
      text: `Visualized algorithm: ${algorithmKey}`,
      date: new Date(),
    });
    if (user.activity.length > 30) {
      user.activity = user.activity.slice(-30);
    }

    user.markModified('profileStats');
    user.markModified('activity');
    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Record algorithm run error:', error);
    res.status(500).json({ error: 'Failed to record algorithm run' });
  }
}
