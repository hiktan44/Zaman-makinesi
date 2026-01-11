import { Request, Response, NextFunction } from 'express';
import passport from '../config/passport';

/**
 * JWT token kontrolü
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ error: 'Sunucu hatası' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Oturum açılmadı veya süresi doldu' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Admin kontrolü
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
  }
  next();
};
