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

// ── Connect to MongoDB (lazy, once) ──
let isConnected = false;
async function ensureDBConnection() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI || '';
  if (!uri) {
    console.error('MONGODB_URI not set');
    return;
  }
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('✅ MongoDB connected (Vercel)');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

// Connect on cold start
ensureDBConnection();

export default app;
