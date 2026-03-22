import { Request, Response } from 'express';
import CustomLayout from '../models/CustomLayout.js';

export async function createLayout(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const layout = await CustomLayout.create({ ...req.body, userId });
    res.status(201).json(layout);
  } catch (error) {
    console.error('Create layout error:', error);
    res.status(500).json({ error: 'Failed to create layout' });
  }
}

export async function getLayouts(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const layouts = await CustomLayout.find({ userId }).sort({ updatedAt: -1 });
    res.json(layouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch layouts' });
  }
}

export async function getLayout(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const layout = await CustomLayout.findOne({ _id: req.params.id, userId });
    if (!layout) {
      res.status(404).json({ error: 'Layout not found' });
      return;
    }
    res.json(layout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch layout' });
  }
}

export async function updateLayout(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const layout = await CustomLayout.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );
    if (!layout) {
      res.status(404).json({ error: 'Layout not found' });
      return;
    }
    res.json(layout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update layout' });
  }
}

export async function deleteLayout(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const layout = await CustomLayout.findOneAndDelete({ _id: req.params.id, userId });
    if (!layout) {
      res.status(404).json({ error: 'Layout not found' });
      return;
    }
    res.json({ message: 'Layout deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete layout' });
  }
}
