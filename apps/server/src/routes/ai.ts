import express from 'express';
import { explainStep } from '../controllers/aiController.js';

const router = express.Router();

router.post('/explain', explainStep);

export default router;
