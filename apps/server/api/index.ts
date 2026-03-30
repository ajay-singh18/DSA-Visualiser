// Vercel serverless entry point inside apps/server/api
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import routes relative to apps/server/api
import authRoutes from '../src/routes/auth.js';
import layoutRoutes from '../src/routes/layouts.js';
import algorithmRoutes from '../src/routes/algorithms.js';
import bookmarkRoutes from '../src/routes/bookmarks.js';
import assessmentRoutes from '../src/routes/assessments.js';
import { errorHandler } from '../src/middleware/errorHandler.js';

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── Connect to MongoDB (lazy, once per worker) ──
let isConnected = false;
async function ensureDBConnection() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in environment variables');
    throw new Error('MONGODB_URI is missing');
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    console.log('✅ MongoDB connected (Vercel)');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}

// Ensure DB is connected BEFORE handling any request in serverless
app.use(async (req, res, next) => {
  try {
    await ensureDBConnection();
    next();
  } catch (error: any) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// ── Routes ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/layouts', layoutRoutes);
app.use('/api/algorithms', algorithmRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/assessments', assessmentRoutes);

// ── Error handler ──
app.use(errorHandler);

export default app;
