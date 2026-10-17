import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import multer, { MulterError } from 'multer';
import type { IdentificationResult } from './gemini.js';

const maximumPhotoBytes = 10 * 1024 * 1024;
const supportedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

export type IdentifyPhoto = (
  image: Buffer,
  mimeType: string
) => Promise<IdentificationResult>;

class UnsupportedImageError extends Error {}

export function createApp(options: {
  identifyPhoto: IdentifyPhoto;
  corsOrigins?: string;
}) {
  const app = express();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maximumPhotoBytes, files: 1, fields: 0 },
    fileFilter: (_request, file, callback) => {
      if (!supportedMimeTypes.has(file.mimetype)) {
        callback(new UnsupportedImageError('Unsupported image type.'));
        return;
      }
      callback(null, true);
    },
  });
  const identifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many identification requests. Try again later.' },
  });

  app.use(cors({ origin: options.corsOrigins?.split(',').map((origin) => origin.trim()) ?? '*' }));
  app.get('/health', (_request, response) => response.json({ status: 'ok' }));
  app.post('/identify', identifyLimiter, upload.single('photo'), async (request, response, next) => {
    if (!request.file) {
      response.status(400).json({ error: 'Choose a photo to identify.' });
      return;
    }

    try {
      const result = await options.identifyPhoto(request.file.buffer, request.file.mimetype);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  const handleError: ErrorRequestHandler = (error, _request, response, _next) => {
    if (error instanceof UnsupportedImageError) {
      response.status(415).json({ error: 'Use a JPEG, PNG, WebP, HEIC, or HEIF photo.' });
      return;
    }

    if (error instanceof MulterError) {
      const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      response.status(status).json({
        error: status === 413 ? 'Photo must be 10 MB or smaller.' : 'Upload one photo in the photo field.',
      });
      return;
    }

    response.status(502).json({ error: 'Identification could not be completed. Try again later.' });
  };
  app.use(handleError);

  return app;
}