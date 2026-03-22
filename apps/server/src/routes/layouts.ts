import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createLayout,
  getLayouts,
  getLayout,
  updateLayout,
  deleteLayout,
} from '../controllers/layoutController.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createLayout);
router.get('/', getLayouts);
router.get('/:id', getLayout);
router.put('/:id', updateLayout);
router.delete('/:id', deleteLayout);

export default router;
