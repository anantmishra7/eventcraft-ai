import { Router, Request, Response } from 'express';
import { config } from '../config/env';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'EventCraft AI Backend',
    isDemoMode: config.isDemoMode,
    model: config.geminiModel,
    uptimeSeconds: Math.round(process.uptime()),
  });
});

export const healthRoutes = router;
