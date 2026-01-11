import { Router } from 'express';
import { getCredits, addCredits } from '../controllers/creditController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// GET /api/credits - Kullanıcının kredi bilgisini getir
router.get('/', authenticateToken, getCredits);

// POST /api/credits/add - Kullanıcıya kredi ekle (admin only)
router.post('/add', authenticateToken, requireAdmin, addCredits);

export default router;
