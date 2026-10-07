import { Router } from 'express';
import { getUsageOverview } from '../controllers/usageController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getUsageOverview);

export default router;
