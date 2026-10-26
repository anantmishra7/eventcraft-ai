import rateLimit from 'express-rate-limit';
import { config } from '../config/env';

/**
 * General application rate limiter (e.g. 100 requests per 15 minutes)
 */
export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});

/**
 * Stricter rate limiter specifically for AI generation and chat endpoints
 */
export const aiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.aiMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error:
      'AI request limit reached for this session. Please wait before generating another plan or chat message.',
  },
});
