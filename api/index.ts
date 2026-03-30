// Vercel serverless entry point
// @vercel/node compiles TypeScript natively - no need for .js extensions
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import routes directly from server source
import authRoutes from '../apps/server/src/routes/auth';
import layoutRoutes from '../apps/server/src/routes/layouts';
import algorithmRoutes from '../apps/server/src/routes/algorithms';
import bookmarkRoutes from '../apps/server/src/routes/bookmarks';
import assessmentRoutes from '../apps/server/src/routes/assessments';
import { errorHandler } from '../apps/server/src/middleware/errorHandler';

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
