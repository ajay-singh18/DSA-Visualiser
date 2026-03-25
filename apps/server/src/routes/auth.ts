import { Router } from 'express';
import { register, login, getMe, googleLogin, updateProfile, recordRaceHistory, recordAlgorithmRun } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, updateProfile);
router.post('/stats/race', authMiddleware, recordRaceHistory);
router.post('/stats/algorithm', authMiddleware, recordAlgorithmRun);

export default router;
