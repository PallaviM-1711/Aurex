import { Request, Response } from 'express';
import { SUBSCRIPTION_PLANS } from '@aurex/shared';
import { mockStore } from '../config/mockStore';

export const getPlans = async (_req: Request, res: Response) => {
  return res.status(200).json(SUBSCRIPTION_PLANS);
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const { plan } = req.body;

    const user = mockStore.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.plan = plan;
    user.aurexConnected = plan === 'aurex_payg' ? true : user.aurexConnected;
    user.subscriptionStatus = 'active';

    return res.status(200).json({ message: 'Subscription tier updated.', plan: user.plan });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Subscription update failed.' });
  }
};
