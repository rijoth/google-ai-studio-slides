// Purpose: Multer middleware for file uploads with validation
// Responsibilities: Configure multer storage, validate file types and sizes
// Public interfaces: upload (multer instance)
// Dependencies: multer, path, fs
// Related files: server/routes/upload.ts

import multer from 'multer';
import path from 'path';
import { getImagesDir } from '../storage/db.js';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, getImagesDir());
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .substring(0, 60);
    const timestamp = Date.now();
    cb(null, `${name}-${timestamp}${ext.toLowerCase()}`);
  },
});

function fileFilter(_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: PNG, JPEG, GIF, WebP, SVG`));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});
