import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[API Error]:', err);
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
  });
};
