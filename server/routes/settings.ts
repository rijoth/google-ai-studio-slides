// Purpose: Settings API routes
// Responsibilities: GET/PUT settings
// Public interfaces: router (Express Router)
// Dependencies: express, ../storage/db
// Related files: server/index.ts

import { Router, Request, Response } from 'express';
import { getSettings, saveSettings } from '../storage/db.js';

export const settingsRouter = Router();

settingsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const data = await getSettings();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

settingsRouter.put('/', async (req: Request, res: Response) => {
  try {
    await saveSettings(req.body);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});
