import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { config } from './config/env';
import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { healthRoutes } from './routes/healthRoutes';
import { planRoutes } from './routes/planRoutes';
import { chatRoutes } from './routes/chatRoutes';

export function createApp(): Application {
  const app = express();

  // 1. Security Headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // Managed on front-end for modern SPA
      crossOriginEmbedderPolicy: false,
    }),
  );

  // 2. Strict CORS Configuration
  const allowedOrigins = [
    config.clientUrl,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://localhost:4173',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || !config.isProduction) {
          return callback(null, true);
        }
        return callback(new Error('Blocked by CORS policy'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }),
  );

  // 3. Response Compression
  app.use(compression());

  // 4. Request Body Size Limiting (Prevents payload inflation DoS)
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  // 5. Global Rate Limiter
  app.use('/api', generalLimiter);

  // 6. API Route Handlers
  app.use('/api/health', healthRoutes);
  app.use('/api/plan', planRoutes);
  app.use('/api/chat', chatRoutes);

  // 7. 404 Catch-All
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'Requested API endpoint not found',
    });
  });

  // 8. Centralized Safe Error Handler
  app.use(errorHandler);

  return app;
}
