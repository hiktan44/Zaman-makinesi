import { Request, Response, NextFunction } from 'express';

// Stripe webhook için raw body middleware
export const webhookRawBody = (req: Request, res: Response, next: NextFunction) => {
  let data = '';

  req.setEncoding('utf8');

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    (req as any).rawBody = Buffer.from(data);
    next();
  });
};
