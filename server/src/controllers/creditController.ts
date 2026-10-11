import { Request, Response } from 'express';
import { getClient, query } from '../config/database';

/**
 * Kullanıcının kredi bilgisini getir
 */
export const getCredits = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Oturum bulunamadı' });
    }

    const userId = req.user.id;

    const result = await query(
      'SELECT credits FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.json({ credits: result.rows[0].credits });
  } catch (error) {
    console.error('Kredi bilgisi hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

/**
 * Görsel üretimi için kredi kullan
 */
export const useCredit = async (userId: number, description: string, metadata?: any) => {
  if (!Number.isSafeInteger(userId) || userId <= 0) throw new Error('Kullanıcı bulunamadı');
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      'UPDATE users SET credits = credits - 1 WHERE id = $1 AND credits >= 1 RETURNING credits', [userId]
    );
    if (result.rowCount !== 1) {
      const user = await client.query('SELECT id FROM users WHERE id = $1', [userId]);
      throw new Error(user.rowCount ? 'Yetersiz kredi' : 'Kullanıcı bulunamadı');
    }
    await client.query(
      `INSERT INTO user_activities (user_id, action_type, credits_used, description, metadata)
       VALUES ($1, 'image_generation', 1, $2, $3)`,
      [userId, description, JSON.stringify(metadata || {})]
    );
    await client.query('COMMIT');
    return { success: true, remainingCredits: result.rows[0].credits };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Kullanıcıya kredi ekle (admin için)
 */
export const addCredits = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Oturum bulunamadı' });
    }

    const { userId, amount, reason } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Kullanıcı ID ve miktar gereklidir' });
    }

    // Kullanıcı var mı kontrol et
    const userCheck = await query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    // Kredi ekle
    await query(
      'UPDATE users SET credits = credits + $1 WHERE id = $2 RETURNING credits',
      [amount, userId]
    );

    // Aktivite kaydı
    await query(
      `INSERT INTO user_activities (user_id, action_type, credits_used, description, metadata) 
       VALUES ($1, 'admin_action', 0, $2, $3)`,
      [userId, `Admin tarafından ${amount} kredi eklendi: ${reason || 'Sebep belirtilmedi'}`, JSON.stringify({ adminId: req.user.id })]
    );

    res.json({ message: 'Kredi başarıyla eklendi' });
  } catch (error) {
    console.error('Kredi ekleme hatası:', error);
    res.status(500).json({ error: 'Kredi ekleme sırasında hata oluştu' });
  }
};
