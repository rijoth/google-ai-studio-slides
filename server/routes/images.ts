// Purpose: Image library management API
// Responsibilities: List, delete images; GET /api/images, DELETE /api/images/:id
// Public interfaces: router (Express Router)
// Dependencies: express, ../storage/db
// Related files: server/index.ts, src/components/Dashboard/ImageLibrary.tsx

import { Router, Request, Response } from 'express';
import { getImageLibrary, deleteImage, getPresentation, savePresentation } from '../storage/db.js';

export const imagesRouter = Router();

imagesRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const data = await getImageLibrary();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

imagesRouter.delete('/:filename', async (req: Request, res: Response) => {
  try {
    const filename = req.params.filename as string;
    const presentation = await getPresentation();

    // Remove from all slides
    for (const slide of presentation.slides) {
      for (const [slot, imgPath] of Object.entries(slide.images)) {
        if (imgPath.includes(filename)) {
          delete slide.images[slot];
        }
      }
    }
    await savePresentation(presentation);
    await deleteImage(filename);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
