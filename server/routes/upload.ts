// Purpose: Image upload API route
// Responsibilities: Handle image upload, process with Sharp, return paths
// Public interfaces: router (Express Router)
// Dependencies: express, multer, sharp, ../middleware/upload, ../utils/imageProcessor, ../storage/db
// Related files: server/index.ts

import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { upload } from '../middleware/upload.js';
import { processImage, generateThumbnail } from '../utils/imageProcessor.js';
import { getThumbsDir } from '../storage/db.js';

export const uploadRouter = Router();

uploadRouter.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No image file provided' });
      return;
    }

    const inputPath = req.file.path;
    const filename = req.file.filename;
    const thumbDir = getThumbsDir();
    const thumbPath = path.join(thumbDir, filename);

    // Process to temp file first, then replace original (sharp can't read/write same file)
    const tmpPath = inputPath + '.tmp';
    try {
      await processImage(inputPath, tmpPath);
      await fs.rename(tmpPath, inputPath);
    } catch (e) {
      await fs.unlink(tmpPath).catch(() => {});
      throw e;
    }
    await generateThumbnail(inputPath, thumbPath);

    res.json({
      success: true,
      path: `/images/${filename}`,
      thumbnail: `/images/thumbs/${filename}`,
      filename,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
