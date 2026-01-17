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
    console.log('📦 Data chunk alındı, boyut:', chunk.length);
    data += chunk;
  });

  req.on('end', () => {
    console.log('✅ Raw body tamamlandı, boyut:', data.length);
    console.log('📝 Raw body preview:', data.substring(0, 100));
    (req as any).rawBody = Buffer.from(data);
    console.log('✅ next() çağrılıyor');
    next();
  });

  req.on('error', (err) => {
    console.error('❌ Webhook middleware hatası:', err);
    next(err);
  });

  // Zaman aşımı kontrolü - 10 saniye içinde veri gelmezse devam et
  setTimeout(() => {
    if (data === '') {
      console.error('⏰ Timeout: 10 saniye içinde veri alınamadı');
      next();
    }
  }, 10000);
};
