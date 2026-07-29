// Purpose: Express server entry point — serves API + static frontend in production
// Responsibilities: Configure Express, mount routes, serve static files, watch for changes
// Public interfaces: Express app (listens on PORT)
// Dependencies: express, cors, path, fs, all route modules
// Related files: server/routes/*, vite.config.ts, package.json

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { presentationRouter } from './routes/presentation.js';
import { settingsRouter } from './routes/settings.js';
import { slidesRouter } from './routes/slides.js';
import { uploadRouter } from './routes/upload.js';
import { imagesRouter } from './routes/images.js';
import { backupRouter } from './routes/backup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api/presentation', presentationRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/slides', slidesRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/images', imagesRouter);
app.use('/api/backup', backupRouter);

// Serve uploaded images
const imagesDir = path.resolve(__dirname, '../storage/images');
app.use('/images', express.static(imagesDir, { maxAge: '1d', etag: true }));

// In production, serve the built frontend
const distPath = path.resolve(__dirname, '../dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Watch presentation.json for changes (hot reload hint for SSE)
let watcher: fs.FSWatcher | null = null;
const storageDir = path.resolve(__dirname, '../storage');
if (fs.existsSync(storageDir)) {
  watcher = fs.watch(storageDir, { recursive: true }, (eventType, filename) => {
    if (filename && (filename === 'presentation.json' || filename === 'settings.json')) {
      console.log(`[watcher] ${filename} changed`);
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/presentation`);
  console.log(`Images: http://localhost:${PORT}/images`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`Frontend served from: ${distPath}`);
  }
});
