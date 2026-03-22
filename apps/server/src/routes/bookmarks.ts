import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  upsertBookmark,
  getBookmarks,
  getBookmark,
  deleteBookmark,
} from '../controllers/bookmarkController.js';

const router = Router();

router.use(authMiddleware);

router.post('/', upsertBookmark);
router.get('/', getBookmarks);
router.get('/find', getBookmark);
router.delete('/:id', deleteBookmark);

export default router;
