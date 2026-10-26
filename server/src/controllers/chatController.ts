import { Request, Response, NextFunction } from 'express';
import { ChatAssistantRequestSchema } from '@eventcraft/shared';
import { geminiService } from '../services/geminiService';
import { cacheService } from '../services/cacheService';
import { logger } from '../utils/logger';

export const chatController = {
  /**
   * POST /api/chat
   * Processes user follow-up questions and returns contextual plan adjustments
   */
  handleChatMessage: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1. Strict input validation with Zod
      const validatedRequest = ChatAssistantRequestSchema.parse(req.body);

      // 2. Cache check for identical message + plan snapshot
      const cacheKey = cacheService.generateKey('chat', {
        message: validatedRequest.message.toLowerCase().trim(),
        planId: validatedRequest.currentPlan.id,
        planUpdatedAt: validatedRequest.currentPlan.updatedAt,
      });

      const cachedResponse = cacheService.get(cacheKey);
      if (cachedResponse) {
        logger.info('Returning cached chat response');
        res.setHeader('X-Cache', 'HIT');
        res.status(200).json({
          success: true,
          data: cachedResponse,
          isCached: true,
        });
        return;
      }

      // 3. Process via Gemini or fallback demo service
      res.setHeader('X-Cache', 'MISS');
      const response = await geminiService.chatAssistant(validatedRequest);

      // 4. Cache response
      cacheService.set(cacheKey, response);

      res.status(200).json({
        success: true,
        data: response,
        isCached: false,
      });
    } catch (error) {
      next(error);
    }
  },
};
