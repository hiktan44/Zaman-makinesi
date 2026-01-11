import { Router } from 'express';
import {
  getDashboard,
  getAllUsers,
  deleteUser,
  getUserActivities,
  getAllActivities,
  getAllPayments,
  updatePackage,
  deletePackage,
  getSettings,
  updateSettings,
  getPackages,
} from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Tüm admin routes authenticate ve require admin middleware kullanır
router.use(authenticateToken, requireAdmin);

// GET /api/admin/dashboard - Dashboard istatistikleri
router.get('/dashboard', getDashboard);

// GET /api/admin/users - Tüm kullanıcıları getir
router.get('/users', getAllUsers);

// DELETE /api/admin/users/:id - Kullanıcı sil
router.delete('/users/:id', deleteUser);

// GET /api/admin/users/:id/activities - Kullanıcının aktivitelerini getir
router.get('/users/:id/activities', getUserActivities);

// GET /api/admin/activities - Tüm aktiviteleri getir
router.get('/activities', getAllActivities);

// GET /api/admin/payments - Tüm ödemeleri getir
router.get('/payments', getAllPayments);

// PUT /api/admin/packages/:id - Paket güncelle/ekle
router.put('/packages/:id', updatePackage);

// DELETE /api/admin/packages/:id - Paket sil
router.delete('/packages/:id', deletePackage);

// GET /api/admin/packages - Tüm paketleri getir
router.get('/packages', getPackages);

// GET /api/admin/settings - Sistem ayarlarını getir
router.get('/settings', getSettings);

// PUT /api/admin/settings - Sistem ayarlarını güncelle
router.put('/settings', updateSettings);

export default router;
