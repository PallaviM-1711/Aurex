import { Router } from 'express';
import { getAdminMetrics, updatePricingRule } from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/metrics', authenticateToken, getAdminMetrics);
router.post('/pricing', authenticateToken, updatePricingRule);

export default router;
