import { createApp } from './app';
import { config } from './config/env';
import { logger } from './utils/logger';

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(`✨ EventCraft AI Server running on port ${config.port}`, {
    env: config.nodeEnv,
    demoMode: config.isDemoMode,
    model: config.geminiModel,
  });
});

// Graceful shutdown
const shutdown = () => {
  logger.info('Shutting down EventCraft server gracefully...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
