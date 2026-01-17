import { Request, Response, NextFunction } from 'express';

// Stripe webhook için raw body middleware
export const webhookRawBody = (req: Request, res: Response, next: NextFunction) => {
  console.log('🚀 Webhook middleware çağrıldı');
  console.log('📋 Method:', req.method);
  console.log('📋 URL:', req.url);
  console.log('📋 Headers:', Object.keys(req.headers));
  
  let data = '';

  req.setEncoding('utf8');

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    console.log('✅ Raw body tamamlandı, boyut:', data.length);
    (req as any).rawBody = Buffer.from(data);
    next();
  });

  req.on('error', (err) => {
    console.error('❌ Webhook middleware hatası:', err);
    next(err);
  });
};
