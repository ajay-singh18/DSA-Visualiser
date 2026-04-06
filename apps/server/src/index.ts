import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import layoutRoutes from './routes/layouts.js';
import algorithmRoutes from './routes/algorithms.js';
import bookmarkRoutes from './routes/bookmarks.js';
import assessmentRoutes from './routes/assessments.js';
import aiRoutes from './routes/ai.js';

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
app.use('/api/ai', aiRoutes);

// ── Error handler ──
app.use(errorHandler);

// ── Start ──
async function start(): Promise<void> {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
}

// In Vercel serverless, we just need the app export; locally we call start()
if (!process.env.VERCEL) {
  start();
} else {
  connectDB();
}

export default app;
