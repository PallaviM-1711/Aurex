import { Router } from 'express';
import { getPlans, updateSubscription } from '../controllers/subscriptionController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/plans', getPlans);
router.post('/update', authenticateToken, updateSubscription);

export default router;
