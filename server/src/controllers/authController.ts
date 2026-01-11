import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { JwtPayload } from '../types';

/**
 * Yeni kullanıcı kaydı
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-posta ve şifre gereklidir' });
    }

    // E-posta kontrolü
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Bu e-posta zaten kayıtlı' });
    }

    // Şifre hashleme
    const password_hash = await bcrypt.hash(password, 10);

    // Ücretsiz kredi miktarını al
    const settingResult = await query(
      "SELECT value FROM system_settings WHERE key = 'free_credits_on_signup'"
    );
    const freeCredits = parseInt(settingResult.rows[0]?.value || '10');

    // Kullanıcıyı oluştur
    const result = await query(
      `INSERT INTO users (email, password_hash, credits) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, is_admin, credits, created_at`,
      [email, password_hash, freeCredits]
    );

    const user = result.rows[0];

    // Aktivite kaydı
    await query(
      `INSERT INTO user_activities (user_id, action_type, credits_used, description) 
       VALUES ($1, 'registration', 0, 'E-posta ile kayıt olundu')`,
      [user.id]
    );

    // JWT token oluştur
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    } as any);

    res.status(201).json({
      message: 'Kayıt başarılı',
      token,
      user: {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ error: 'Kayıt sırasında hata oluştu' });
  }
};

/**
 * Kullanıcı girişi
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-posta ve şifre gereklidir' });
    }

    // Kullanıcıyı bul
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
    }

    const user = result.rows[0];

    // Şifre kontrolü
    if (!user.password_hash) {
      return res.status(401).json({ 
        error: 'Bu hesap Google ile oluşturuldu. Google ile giriş yapın.' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
    }

    // Aktivite kaydı
    await query(
      `INSERT INTO user_activities (user_id, action_type, credits_used, description) 
       VALUES ($1, 'login', 0, 'Kullanıcı giriş yaptı')`,
      [user.id]
    );

    // JWT token oluştur
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    } as any);

    res.json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ error: 'Giriş sırasında hata oluştu' });
  }
};

/**
 * Mevcut kullanıcı bilgisi
 */
export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Oturum bulunamadı' });
    }

    const userId = req.user.id;

    const result = await query(
      'SELECT id, email, is_admin, credits, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Kullanıcı bilgisi hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

/**
 * Google ile giriş başlat
 */
export const googleAuth = (req: Request, res: Response, next: any) => {
  // Google callback frontend'e yönlendirilecek
  next();
};

/**
 * Google callback
 */
export const googleCallback = (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Oturum bulunamadı' });
    }

    const user = req.user as any;
    
    // JWT token oluştur
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    } as any);

    // Frontend'e yönlendir
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/google/callback?token=${token}`);
  } catch (error) {
    console.error('Google callback hatası:', error);
    res.status(500).json({ error: 'Google girişi başarısız' });
  }
};
