import { Router } from 'express';
import { executeAlgorithm } from '../controllers/algorithmController.js';

const router = Router();

// Public — no auth needed to run algorithms
router.post('/run', executeAlgorithm);

export default router;
