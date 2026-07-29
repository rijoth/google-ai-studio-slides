// Purpose: Image processing with Sharp — resize, optimize, generate thumbnails
// Responsibilities: Process uploaded images to consistent sizes, create thumbnails
// Public interfaces: processImage, generateThumbnail
// Dependencies: sharp
// Related files: server/middleware/upload.ts, server/routes/upload.ts

import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1200;
const THUMB_WIDTH = 400;
const THUMB_HEIGHT = 250;
const QUALITY = 85;

export async function processImage(inputPath: string, outputPath: string): Promise<{ width: number; height: number }> {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  let pipeline = image;
  if (metadata.width && metadata.height) {
    const aspectRatio = metadata.width / metadata.height;
    let targetWidth = metadata.width;
    let targetHeight = metadata.height;

    if (targetWidth > MAX_WIDTH) {
      targetWidth = MAX_WIDTH;
      targetHeight = Math.round(MAX_WIDTH / aspectRatio);
    }
    if (targetHeight > MAX_HEIGHT) {
      targetHeight = MAX_HEIGHT;
      targetWidth = Math.round(MAX_HEIGHT * aspectRatio);
    }

    pipeline = pipeline.resize(targetWidth, targetHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const ext = path.extname(outputPath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: QUALITY, progressive: true });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9 });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: QUALITY });
  }

  await pipeline.toFile(outputPath);

  const finalMeta = await sharp(outputPath).metadata();
  return { width: finalMeta.width || 0, height: finalMeta.height || 0 };
}

export async function generateThumbnail(inputPath: string, outputPath: string): Promise<void> {
  await sharp(inputPath)
    .resize(THUMB_WIDTH, THUMB_HEIGHT, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 70, progressive: true })
    .toFile(outputPath);
}
