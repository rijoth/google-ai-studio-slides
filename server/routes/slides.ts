// Purpose: Individual slide API routes
// Responsibilities: PUT /api/slides/:id — update a single slide's images
// Public interfaces: router (Express Router)
// Dependencies: express, ../storage/db
// Related files: server/index.ts, server/routes/upload.ts

import { Router, Request, Response } from 'express';
import { getPresentation, savePresentation } from '../storage/db.js';

export const slidesRouter = Router();

slidesRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const presentation = await getPresentation();
    const slide = presentation.slides.find(s => s.id === req.params.id);
    if (!slide) {
      res.status(404).json({ success: false, error: 'Slide not found' });
      return;
    }

    if (req.body.images) {
      slide.images = { ...slide.images, ...req.body.images };
    }
    if (req.body.speakerNotes !== undefined) {
      slide.speakerNotes = req.body.speakerNotes;
    }

    await savePresentation(presentation);
    res.json({ success: true, data: slide });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});
