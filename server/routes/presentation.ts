// Purpose: Presentation data API routes
// Responsibilities: GET/PUT presentation, provide full slide data
// Public interfaces: router (Express Router)
// Dependencies: express, ../storage/db
// Related files: server/index.ts, src/api/client.ts

import { Router, Request, Response } from 'express';
import { getPresentation, savePresentation } from '../storage/db.js';

export const presentationRouter = Router();

presentationRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const data = await getPresentation();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

presentationRouter.put('/', async (req: Request, res: Response) => {
  try {
    await savePresentation(req.body);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});
