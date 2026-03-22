import { Request, Response } from 'express';
import Bookmark from '../models/Bookmark.js';

export async function upsertBookmark(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { layoutId, algorithmKey, snapshotIndex, playbackSpeed, notes } = req.body;

    if (!layoutId || !algorithmKey) {
      res.status(400).json({ error: 'layoutId and algorithmKey are required' });
      return;
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { userId, layoutId, algorithmKey },
      { snapshotIndex: snapshotIndex ?? 0, playbackSpeed: playbackSpeed ?? 1, notes },
      { new: true, upsert: true }
    );
    res.json(bookmark);
  } catch (error) {
    console.error('Upsert bookmark error:', error);
    res.status(500).json({ error: 'Failed to save bookmark' });
  }
}

export async function getBookmarks(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const bookmarks = await Bookmark.find({ userId })
      .populate('layoutId', 'title dataType')
      .sort({ updatedAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
}

export async function getBookmark(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { layoutId, algorithmKey } = req.query;
    const bookmark = await Bookmark.findOne({ userId, layoutId, algorithmKey });
    if (!bookmark) {
      res.status(404).json({ error: 'Bookmark not found' });
      return;
    }
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookmark' });
  }
}

export async function deleteBookmark(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, userId });
    if (!bookmark) {
      res.status(404).json({ error: 'Bookmark not found' });
      return;
    }
    res.json({ message: 'Bookmark deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
}
