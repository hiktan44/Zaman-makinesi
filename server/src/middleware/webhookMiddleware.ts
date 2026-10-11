import express, { Request, Response, NextFunction } from 'express';

const parseRaw = express.raw({ type: 'application/json', limit: '1mb' });

/** İmza kontrolü için gövdeyi değiştirmeden ve içeriğini loglamadan alır. */
export const webhookRawBody = (req: Request, res: Response, next: NextFunction) => {
  parseRaw(req, res, (error: any) => {
    if (error) return res.status(error.status === 413 ? 413 : 400).json({ error: 'Ödeme bildirimi gövdesi geçersiz' });
    if (!Buffer.isBuffer(req.body)) return res.status(400).json({ error: 'Ödeme bildirimi JSON olmalıdır' });
    (req as any).rawBody = req.body;
    next();
  });
};
