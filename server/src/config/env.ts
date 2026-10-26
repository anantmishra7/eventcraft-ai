import dotenv from 'dotenv';
import path from 'path';

// Load .env from server directory or root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  isDemoMode:
    !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_gemini_api_key'),
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    aiMaxRequests: parseInt(process.env.AI_RATE_LIMIT_MAX_REQUESTS || '30', 10),
  },
  cache: {
    ttlMs: parseInt(process.env.CACHE_TTL_MS || '3600000', 10), // 1 hour
    maxItems: 200,
  },
};
