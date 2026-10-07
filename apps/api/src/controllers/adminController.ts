import { Request, Response } from 'express';
import { pricingEngine } from '../services/pricingEngine';
import { mockStore } from '../config/mockStore';

export const getAdminMetrics = async (_req: Request, res: Response) => {
  return res.status(200).json({
    totalUsers: 14280,
    activeUsers: 9840,
    subscriptionMRR: 2380000,
    aurexPAYGVolume: 842500,
    totalAIRequests: 1840000,
    pricingRules: pricingEngine.getAllRules(),
    systemHealth: {
      aurexGateway: 'optimal',
      aiProviders: 'optimal',
      database: 'connected',
    },
  });
};

export const updatePricingRule = async (req: Request, res: Response) => {
  const { serviceType, rateINR, minChargeINR } = req.body;
  if (!serviceType) {
    return res.status(400).json({ message: 'serviceType is required' });
  }

  const updated = pricingEngine.updateRule(serviceType, { rateINR, minChargeINR });
  return res.status(200).json(updated);
};
