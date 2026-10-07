import { Request, Response } from 'express';
import { usageMeter } from '../services/usageMeter';

export const getUsageOverview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const overview = usageMeter.getAnalyticsOverview(userId);
    return res.status(200).json(overview);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to fetch usage analytics.' });
  }
};
