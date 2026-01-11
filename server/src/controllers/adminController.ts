import { Request, Response } from 'express';
import { query } from '../config/database';

/**
 * Dashboard istatistikleri
 */
export const getDashboard = async (req: Request, res: Response) => {
  try {
    // Toplam kullanıcı sayısı
    const totalUsers = await query('SELECT COUNT(*) as count FROM users');
    
    // Toplam kredi üretimi
    const totalCreditsGenerated = await query(
      "SELECT SUM(credits_used) as total FROM user_activities WHERE action_type = 'image_generation'"
    );
    
    // Toplam gelir (completed payments)
    const totalRevenue = await query(
      "SELECT COALESCE(SUM(amount_try), 0) as total FROM payments WHERE status = 'completed'"
    );
    
    // Aktif ödemeler (pending)
    const activePayments = await query(
      "SELECT COUNT(*) as count FROM payments WHERE status = 'pending'"
    );
    
    // Son 7 günün aktiviteleri
    const recentActivities = await query(
      `SELECT ua.*, u.email 
       FROM user_activities ua 
       JOIN users u ON ua.user_id = u.id 
       ORDER BY ua.created_at DESC 
       LIMIT 10`
    );

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalCreditsGenerated: parseInt(totalCreditsGenerated.rows[0].total || '0'),
      totalRevenue: parseFloat(totalRevenue.rows[0].total || '0'),
      activePayments: parseInt(activePayments.rows[0].count),
      recentActivities: recentActivities.rows,
    });
  } catch (error) {
    console.error('Dashboard hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

/**
 * Tüm kullanıcıları getir
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let queryText = `
      SELECT id, email, is_admin, credits, created_at 
      FROM users 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      queryText += ` AND email ILIKE $${params.length + 1}`;
      params.push(`%${search}%`);
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit as string), offset);

    const result = await query(queryText, params);

    // Toplam sayıyı al
    let countQuery = 'SELECT COUNT(*) FROM users WHERE 1=1';
    const countParams: any[] = [];
    
    if (search) {
      countQuery += ` AND email ILIKE $${countParams.length + 1}`;
      countParams.push(`%${search}%`);
    }
    
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      users: result.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Kullanıcıları getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

/**
 * Kullanıcıyı sil
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Admin'i silemezsin
    const userCheck = await query('SELECT is_admin FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    if (userCheck.rows[0].is_admin) {
      return res.status(403).json({ error: 'Admin kullanıcısı silinemez' });
    }

    // Önce kullanıcı aktivitelerini sil
    await query('DELETE FROM user_activities WHERE user_id = $1', [id]);
    
    // Sonra ödemeleri sil
    await query('DELETE FROM payments WHERE user_id = $1', [id]);
    
    // Son olarak kullanıcıyı sil
    await query('DELETE FROM users WHERE id = $1', [id]);

    res.json({ message: 'Kullanıcı başarıyla silindi' });
  } catch (error) {
    console.error('Kullanıcı silme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

/**
 * Kullanıcının aktivitelerini getir
 */
export const getUserActivities = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const result = await query(
      `SELECT * FROM user_activities 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [id, parseInt(limit as string), offset]
    );

    res.json({ activities: result.rows });
  } catch (error) {
    console.error('Aktiviteleri getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

/**
 * Tüm aktiviteleri getir
 */
export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const result = await query(
      `SELECT ua.*, u.email 
       FROM user_activities ua 
       JOIN users u ON ua.user_id = u.id 
       ORDER BY ua.created_at DESC 
       LIMIT $1 OFFSET $2`,
      [parseInt(limit as string), offset]
    );

    const totalResult = await query('SELECT COUNT(*) FROM user_activities');
    const total = parseInt(totalResult.rows[0].count);

    res.json({
      activities: result.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Aktiviteleri getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

/**
 * Tüm ödemeleri getir
 */
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let queryText = `
      SELECT p.*, u.email, cp.credits as package_credits, cp.price_try 
      FROM payments p 
      JOIN users u ON p.user_id = u.id 
      JOIN credit_packages cp ON p.package_id = cp.id 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      queryText += ` AND p.status = $${params.length + 1}`;
      params.push(status);
    }

    queryText += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit as string), offset);

    const result = await query(queryText, params);

    const countQuery = status 
      ? 'SELECT COUNT(*) FROM payments WHERE status = $1'
      : 'SELECT COUNT(*) FROM payments';
    const countParams = status ? [status] : [];
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      payments: result.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Ödemeleri getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

/**
 * Paketleri güncelle/ekle/sil
 */
export const updatePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { credits, price_try, is_active } = req.body;

    if (!credits || !price_try) {
      return res.status(400).json({ error: 'Kredi ve fiyat gereklidir' });
    }

    if (id === 'new') {
      // Yeni paket oluştur
      const result = await query(
        'INSERT INTO credit_packages (credits, price_try, is_active) VALUES ($1, $2, $3) RETURNING *',
        [credits, price_try, is_active !== false]
      );
      res.status(201).json({ package: result.rows[0] });
    } else {
      // Var olan paketi güncelle
      const result = await query(
        `UPDATE credit_packages 
         SET credits = $1, price_try = $2, is_active = $3 
         WHERE id = $4 
         RETURNING *`,
        [credits, price_try, is_active !== false, parseInt(id)]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Paket bulunamadı' });
      }

      res.json({ package: result.rows[0] });
    }
  } catch (error) {
    console.error('Paket güncelleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

/**
 * Paket sil
 */
export const deletePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await query('DELETE FROM credit_packages WHERE id = $1', [id]);

    res.json({ message: 'Paket başarıyla silindi' });
  } catch (error) {
    console.error('Paket silme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

/**
 * Tüm paketleri getir
 */
export const getPackages = async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM credit_packages ORDER BY credits ASC'
    );

    res.json({ packages: result.rows });
  } catch (error) {
    console.error('Paketleri getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

/**
 * Sistem ayarları getir
 */
export const getSettings = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM system_settings');
    
    const settings: Record<string, string> = {};
    result.rows.forEach((row: any) => {
      settings[row.key] = row.value;
    });

    res.json({ settings });
  } catch (error) {
    console.error('Ayarları getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

/**
 * Sistem ayarlarını güncelle
 */
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { settings } = req.body;

    for (const [key, value] of Object.entries(settings)) {
      await query(
        `INSERT INTO system_settings (key, value) 
         VALUES ($1, $2) 
         ON CONFLICT (key) DO UPDATE SET value = $2`,
        [key, value]
      );
    }

    res.json({ message: 'Ayarlar başarıyla güncellendi' });
  } catch (error) {
    console.error('Ayar güncelleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};
