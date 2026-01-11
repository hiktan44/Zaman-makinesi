import { Router } from 'express';
import passport from '../config/passport';
import { register, login, getMe, googleCallback } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// POST /api/auth/register - Yeni kullanıcı kaydı
router.post('/register', register);

// POST /api/auth/login - Kullanıcı girişi
router.post('/login', login);

// GET /api/auth/me - Mevcut kullanıcı bilgisi (token gerekli)
router.get('/me', authenticateToken, getMe);

// GET /api/auth/google - Google ile giriş başlat
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// GET /api/auth/google/callback - Google callback
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`,
    session: false
  }),
  googleCallback
);

export default router;
