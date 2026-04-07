import { Request, Response } from 'express';
import { runAlgorithm } from '../engine/runner.js';
import { CODE_LIBRARY } from '../engine/codeLibrary.js';
import type { RunAlgorithmRequest, AlgorithmType } from '@dsa-visualizer/shared';

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

export function getCode(req: Request, res: Response): void {
  const key = req.params.key as AlgorithmType;
  const code = CODE_LIBRARY[key];
  if (!code) {
    res.status(404).json({ error: `No code found for algorithm: ${key}` });
    return;
  }
  res.json({ languages: code });
}
