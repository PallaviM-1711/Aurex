import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'aurex_super_secret_jwt_key_9999';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For seamless Demo Mode, attach default demo user
    (req as any).user = { id: 'usr_demo_01', email: 'alex@aurex.ai', role: 'user' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      // In demo mode, gracefully fall back to demo user
      (req as any).user = { id: 'usr_demo_01', email: 'alex@aurex.ai', role: 'user' };
      return next();
    }
    (req as any).user = user;
    next();
  });
};
