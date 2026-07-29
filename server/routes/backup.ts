// Purpose: Backup & restore API
// Responsibilities: Export ZIP of all config+images, import from ZIP
// Public interfaces: router (Express Router)
// Dependencies: express, archiver, unzipper, fs, path, ../storage/db
// Related files: server/index.ts

import { Router, Request, Response } from 'express';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { getPresentation, savePresentation, getSettings, saveSettings, getImagesDir } from '../storage/db.js';
import multer from 'multer';

const backupUpload = multer({ dest: '/tmp/presentation-backups' });

export const backupRouter = Router();

backupRouter.get('/export', async (_req: Request, res: Response) => {
  try {
    const archive = archiver('zip', { zlib: { level: 9 } });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="presentation-backup.zip"');

    archive.on('error', (err) => { throw err; });
    archive.pipe(res);

    const presentation = await getPresentation();
    const settings = await getSettings();
    archive.append(JSON.stringify(presentation, null, 2), { name: 'presentation.json' });
    archive.append(JSON.stringify(settings, null, 2), { name: 'settings.json' });

    const imagesDir = getImagesDir();
    if (fs.existsSync(imagesDir)) {
      archive.directory(imagesDir, 'images');
    }

    await archive.finalize();
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

backupRouter.post('/import', backupUpload.single('backup'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No backup file provided' });
      return;
    }

    const unzipper = await import('unzipper');
    const extractDir = path.join('/tmp/presentation-backups', `import-${Date.now()}`);
    await fs.promises.mkdir(extractDir, { recursive: true });

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(req.file!.path)
        .pipe(unzipper.Extract({ path: extractDir }))
        .on('close', resolve)
        .on('error', reject);
    });

    // Restore presentation.json
    const presPath = path.join(extractDir, 'presentation.json');
    if (fs.existsSync(presPath)) {
      const presData = JSON.parse(await fs.promises.readFile(presPath, 'utf-8'));
      await savePresentation(presData);
    }

    // Restore settings.json
    const setPath = path.join(extractDir, 'settings.json');
    if (fs.existsSync(setPath)) {
      const setData = JSON.parse(await fs.promises.readFile(setPath, 'utf-8'));
      await saveSettings(setData);
    }

    // Restore images
    const importImagesDir = path.join(extractDir, 'images');
    const targetImagesDir = getImagesDir();
    if (fs.existsSync(importImagesDir)) {
      const files = await fs.promises.readdir(importImagesDir);
      for (const file of files) {
        const src = path.join(importImagesDir, file);
        const dest = path.join(targetImagesDir, file);
        if ((await fs.promises.stat(src)).isFile()) {
          await fs.promises.copyFile(src, dest);
        }
      }
    }

    // Cleanup
    await fs.promises.rm(extractDir, { recursive: true, force: true });
    await fs.promises.unlink(req.file.path);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
