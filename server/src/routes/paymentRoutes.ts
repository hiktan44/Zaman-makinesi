import { Router } from 'express';
import { getPackages, createCheckoutSession, handleWebhook, getUserPayments } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// GET /api/packages - Kredi paketlerini getir (public)
router.get('/packages', getPackages);

// POST /api/payments/create-checkout - Checkout session oluştur (token gerekli)
router.post('/payments/create-checkout', authenticateToken, createCheckoutSession);

// POST /api/payments/webhook - Stripe webhook (public, signature ile korumalı)
router.post('/payments/webhook', handleWebhook);

// GET /api/payments - Kullanıcının ödemelerini getir (token gerekli)
router.get('/payments', authenticateToken, getUserPayments);

export default router;
