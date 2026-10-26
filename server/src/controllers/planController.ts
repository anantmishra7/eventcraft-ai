import { Request, Response, NextFunction } from 'express';
import { EventSetupInputSchema } from '@eventcraft/shared';
import { geminiService } from '../services/geminiService';
import { cacheService } from '../services/cacheService';
import { getCuratedDemoPlans } from '../services/demoPlanService';
import { logger } from '../utils/logger';

export const planController = {
  /**
   * POST /api/plan/generate
   * Generates or retrieves cached structured event plan
   */
  generatePlan: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1. Strict input validation with Zod
      const validatedInput = EventSetupInputSchema.parse(req.body);

      // 2. Check LRU Cache for identical requests
      const cacheKey = cacheService.generateKey('plan', validatedInput);
      const cachedPlan = cacheService.get<{ plan: unknown; isDemo: boolean }>(cacheKey);

      if (cachedPlan) {
        logger.info('Returning cached plan', { eventName: validatedInput.eventName });
        res.setHeader('X-Cache', 'HIT');
        res.status(200).json({
          success: true,
          data: cachedPlan.plan,
          isDemo: cachedPlan.isDemo,
          isCached: true,
        });
        return;
      }

      // 3. Generate plan via Gemini or fallback demo service
      res.setHeader('X-Cache', 'MISS');
      const { plan, isDemo } = await geminiService.generatePlan(validatedInput);

      // 4. Store in cache
      cacheService.set(cacheKey, { plan, isDemo });

      res.status(200).json({
        success: true,
        data: plan,
        isDemo,
        isCached: false,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/plan/demo-plans
   * Returns pre-curated demo templates (e.g. Wedding, Birthday)
   */
  getDemoPlans: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const demoPlans = getCuratedDemoPlans();
      res.status(200).json({
        success: true,
        data: demoPlans,
      });
    } catch (error) {
      next(error);
    }
  },
};
