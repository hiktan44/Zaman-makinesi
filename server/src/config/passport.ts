import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { query } from './database';
import { JwtPayload } from '../types';

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_REDIRECT_URI!,
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error('Google email bulunamadı'));
        }

        // Kullanıcıyı bul veya oluştur
        const result = await query(
          'SELECT * FROM users WHERE google_id = $1 OR email = $2',
          [googleId, email]
        );

        if (result.rows.length === 0) {
          // Yeni kullanıcı oluştur
          const freeCredits = await getFreeCreditsOnSignup();
          const newUser = await query(
            `INSERT INTO users (email, google_id, credits) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [email, googleId, freeCredits]
          );
          
          // Aktivite kaydı
          await logActivity(newUser.rows[0].id, 'registration', 0, 'Google ile kayıt oldu');
          
          return done(null, newUser.rows[0]);
        } else {
          // Google ID'yi güncelle (eğer daha önce email ile kayıt olduysa)
          const user = result.rows[0];
          if (!user.google_id) {
            await query(
              'UPDATE users SET google_id = $1 WHERE id = $2',
              [googleId, user.id]
            );
          }
          
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    },
    async (payload: JwtPayload, done: any) => {
      try {
        const result = await query('SELECT * FROM users WHERE id = $1', [payload.id]);
        
        if (result.rows.length === 0) {
          return done(null, false);
        }
        
        return done(null, result.rows[0]);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Yardımcı fonksiyonlar
async function getFreeCreditsOnSignup(): Promise<number> {
  const result = await query(
    "SELECT value FROM system_settings WHERE key = 'free_credits_on_signup'"
  );
  return parseInt(result.rows[0]?.value || '10');
}

async function logActivity(userId: number, actionType: string, creditsUsed: number, description: string) {
  await query(
    `INSERT INTO user_activities (user_id, action_type, credits_used, description) 
     VALUES ($1, $2, $3, $4)`,
    [userId, actionType, creditsUsed, description]
  );
}

export default passport;
