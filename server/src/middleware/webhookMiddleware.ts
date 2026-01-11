import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

// Stripe webhook için raw body middleware
export const webhookRawBody = bodyParser.raw({
  type: 'application/json',
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
});
