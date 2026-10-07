import { Router } from 'express';
import {
  estimateCost,
  executePayment,
  getBalance,
  getTransactions,
  topUpWallet,
} from '../controllers/aurexController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/estimate', authenticateToken, estimateCost);
router.post('/pay', authenticateToken, executePayment);
router.get('/balance', authenticateToken, getBalance);
router.get('/transactions', authenticateToken, getTransactions);
router.post('/topup', authenticateToken, topUpWallet);

export default router;
