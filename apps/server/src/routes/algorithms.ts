import { Router } from 'express';
import { executeAlgorithm, getCode } from '../controllers/algorithmController.js';

const router = Router();

// Public — no auth needed to run algorithms
router.post('/run', executeAlgorithm);
router.get('/code/:key', getCode);

export default router;
