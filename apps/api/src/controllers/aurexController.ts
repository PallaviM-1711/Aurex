import { Request, Response } from 'express';
import { aurexProvider } from '../providers/MockAurexProvider';

export const estimateCost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const { serviceType, usageMetric } = req.body;

    if (!serviceType || !usageMetric) {
      return res.status(400).json({ message: 'serviceType and usageMetric are required.' });
    }

    const estimate = await aurexProvider.estimateCost(userId, serviceType, usageMetric);
    return res.status(200).json(estimate);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Cost estimation failed.' });
  }
};

export const executePayment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const { quoteId, serviceType, estimatedCostINR } = req.body;

    if (!serviceType || estimatedCostINR === undefined) {
      return res.status(400).json({ message: 'serviceType and estimatedCostINR are required.' });
    }

    const paymentResult = await aurexProvider.executePayment(userId, quoteId, serviceType, estimatedCostINR);
    return res.status(200).json(paymentResult);
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Payment execution failed.' });
  }
};

export const getBalance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const wallet = await aurexProvider.getWallet(userId);
    return res.status(200).json(wallet);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to fetch wallet.' });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const txns = await aurexProvider.getTransactions(userId);
    return res.status(200).json(txns);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to fetch transactions.' });
  }
};

export const topUpWallet = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const { amountINR } = req.body;
    const result = await aurexProvider.topUpWallet(userId, amountINR || 100);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Top up failed.' });
  }
};
