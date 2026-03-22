import { Request, Response } from 'express';
import { runAlgorithm } from '../engine/runner.js';
import type { RunAlgorithmRequest } from '@dsa-visualizer/shared';

export function executeAlgorithm(req: Request, res: Response): void {
  try {
    const body = req.body as RunAlgorithmRequest;

    if (!body.algorithmKey || !body.data) {
      res.status(400).json({ error: 'algorithmKey and data are required' });
      return;
    }

    const result = runAlgorithm(body);
    res.json(result);
  } catch (error: any) {
    console.error('Algorithm execution error:', error.message);
    res.status(400).json({ error: error.message });
  }
}
