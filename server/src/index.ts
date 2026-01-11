import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { testConnection } from './config/database';
import passport from './config/passport';

// Routes
import authRoutes from './routes/authRoutes';
import creditRoutes from './routes/creditRoutes';
import paymentRoutes from './routes/paymentRoutes';
import adminRoutes from './routes/adminRoutes';

// Services
import { useCredit } from './controllers/creditController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Not: Stripe webhook raw body parsing, paymentRoutes.ts'de route-specific olarak yapılıyor

// Passport middleware
app.use(passport.initialize());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes health check
app.get('/api', (req: Request, res: Response) => {
  res.json({ 
    message: 'API çalışıyor',
    routes: [
      '/api/auth - Authentication',
      '/api/credits - Credit management',
      '/api/payments - Payments',
      '/api/admin - Admin panel',
      '/api/image/use-credit - Use credit for image generation',
      '/api/image/generate - Generate image (legacy)'
    ]
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Özel endpoint: Görsel üretimi için kredi kullan
app.post('/api/image/use-credit', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    // İstek yapan kullanıcı ile userId eşleşiyor mu kontrol et
    const requestUser = req.user as any;
    if (requestUser.id !== userId) {
      return res.status(403).json({ error: 'Yetkisiz işlem' });
    }
    
    const { description, metadata } = req.body;
    
    const result = await useCredit(userId, description, metadata);
    res.json(result);
  } catch (error: any) {
    if (error.message === 'Yetersiz kredi') {
      return res.status(400).json({ error: 'Yetersiz kredi. Lütfen kredi satın alın.' });
    }
    console.error('Kredi kullanma hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint bulunamadı' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Sunucu hatası',
  });
});

// Start server
async function startServer() {
  const connected = await testConnection();
  
  if (connected) {
    app.listen(PORT, () => {
      console.log(`🚀 Server ${PORT} portunda çalışıyor`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
  } else {
    console.error('❌ Veritabanı bağlantısı başarısız. Server başlatılamadı.');
    process.exit(1);
  }
}

startServer();
