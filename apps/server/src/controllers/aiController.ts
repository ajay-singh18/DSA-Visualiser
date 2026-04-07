import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';

export const explainStep = async (req: Request, res: Response): Promise<void> => {
  try {
    const { algorithmName, codeLine, snapshotDescription, variables } = req.body;

    if (!env.GEMINI_API_KEY) {
      res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
      return;
    }

    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert Computer Science tutor explaining an algorithm step-by-step.
Context: The student is watching a visualization of ${algorithmName}.
Current Step Description: ${snapshotDescription}
Active Code Line: ${codeLine || 'N/A'}
Current Variables: ${JSON.stringify(variables, null, 2)}

Provide a very concise, 1-2 sentence explanation of WHY this specific step is happening based on the algorithm's logic. Explain it simply. Do not use markdown backticks, just output plain text. Keep it very short.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ explanation: responseText.trim() });
  } catch (error: any) {
    console.error('AI Explanation Error:', error?.message || error);
    res.status(500).json({ error: 'Failed to generate explanation.', detail: error?.message || String(error) });
  }
};
