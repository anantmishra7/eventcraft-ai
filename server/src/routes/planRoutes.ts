import { Router } from 'express';
import { planController } from '../controllers/planController';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/generate', aiLimiter, planController.generatePlan);
router.get('/demo-plans', planController.getDemoPlans);

export const planRoutes = router;
