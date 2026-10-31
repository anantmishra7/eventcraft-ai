import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import fs from 'fs';
import path from 'path';
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

  // 2. Response Compression
  app.use(compression());

  // 3. Serve Client SPA static assets with permissive CORS for scripts, styles & fonts
  const clientDistPath = path.resolve(__dirname, '../../client/dist');
  if (fs.existsSync(clientDistPath)) {
    app.use(
      express.static(clientDistPath, {
        maxAge: config.isProduction ? '1d' : 0,
        setHeaders: (res, filePath) => {
          // Allow cross-origin requests for static assets (required for <script type="module" crossorigin>)
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          }
        },
      }),
    );
  }

  // Explicit permissive CORS for /assets directory
  app.use('/assets', (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // 4. Request Body Size Limiting (Prevents payload inflation DoS)
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  // 5. Targeted Strict CORS Configuration for API Routes
  const allowedOrigins = [
    'https://eventcraft-ai1.onrender.com',
    config.clientUrl,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://localhost:4173',
  ].filter(Boolean);

  const apiCors = cors((req, callback) => {
    const originHeader = req.headers.origin;
    const origin = Array.isArray(originHeader) ? originHeader[0] : originHeader;
    const hostHeader = req.headers.host;
    const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;

    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) {
      return callback(null, { origin: true });
    }

    // Always allow during development / non-production
    if (!config.isProduction) {
      return callback(null, {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      });
    }

    // Allow configured production and dev origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      });
    }

    // Same-origin verification & *.onrender.com wildcard support
    try {
      const originUrl = new URL(origin);

      // Same-origin: origin host matches incoming Host header
      if (host) {
        const cleanHost = host.split(':')[0].toLowerCase();
        if (originUrl.hostname.toLowerCase() === cleanHost) {
          return callback(null, {
            origin: true,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
          });
        }
      }

      // Any Render deployment subdomain (*.onrender.com)
      if (originUrl.hostname.toLowerCase().endsWith('.onrender.com')) {
        return callback(null, {
          origin: true,
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        });
      }
    } catch {
      // Malformed origin URL
    }

    return callback(new Error('Blocked by CORS policy'));
  });

  // Apply API-specific CORS
  app.use('/api', apiCors);

  // 6. Global Rate Limiter
  app.use('/api', generalLimiter);

  // 7. API Route Handlers
  app.use('/api/health', healthRoutes);
  app.use('/api/plan', planRoutes);
  app.use('/api/chat', chatRoutes);

  // 8. Serve Client SPA static assets fallback in production
  if (fs.existsSync(clientDistPath)) {
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }

  // 9. 404 Catch-All for unknown API routes
  app.use('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'Requested API endpoint not found',
    });
  });

  // 10. Centralized Safe Error Handler
  app.use(errorHandler);

  return app;
}
