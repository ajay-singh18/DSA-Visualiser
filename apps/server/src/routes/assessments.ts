import { Router } from 'express';
import { startAssessment, submitAssessment, getAssessmentHistory, getAssessmentStats, getSessionResults } from '../controllers/assessmentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All assessment routes require authentication
router.use(authMiddleware);

router.post('/start', startAssessment);
router.post('/submit', submitAssessment);
router.get('/history', getAssessmentHistory);
router.get('/stats', getAssessmentStats);
router.get('/results/:sessionId', getSessionResults);

export default router;
