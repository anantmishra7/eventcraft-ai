import { Router } from 'express';
import { chatController } from '../controllers/chatController';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', aiLimiter, chatController.handleChatMessage);

export const chatRoutes = router;
