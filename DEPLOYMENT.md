# Zaman Makinesi - Kurulum ve Deploy Talimatları

## 🚀 Proje Özeti

Bu proje, görsel üretim tabanlı bir uygulama olup şu özellikleri içerir:
- Stripe ile ödeme entegrasyonu
- Kullanıcı giriş/kayıt sistemi (E-posta + Google OAuth)
- Kredi sistemi
- Admin paneli (Kullanıcı yönetimi, Aktiviteler, Ödemeler, Ayarlar)
- Neon PostgreSQL veritabanı

## 📋 Ön Koşullar

- Node.js (v18+)
- PostgreSQL veritabanı (Neon kullanılıyor)
- Stripe hesabı (test modu yeterli)
- Google Cloud Console (OAuth için)

## 🔧 Kurulum Adımları

### 1. Backend Kurulumu

```bash
# Backend klasörüne git
cd server

# Dependencies kur
npm install

# Environment variables oluştur
cp .env.example .env
```

#### server/.env Dosyasını Doldur:

```env
# Database
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 2. Veritabanı Migration

```bash
cd server

# Tabloları oluştur
npm run migrate
```

İlk admin kullanıcısı için:

```sql
-- Email'inizi değiştirin
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
```

### 3. Frontend Kurulumu

```bash
# Ana dizine dön
cd ..

# Frontend dependencies
npm install
```

#### .env Dosyasını Güncelle:

```env
VITE_API_KEY=AIzaSyByyT0fQQGSpwcF7gEPS8dJSeSzrJnnRRY
VITE_API_URL=http://localhost:3001/api
```

## 🏃 Uygulamayı Çalıştırma

### Backend Başlat:

```bash
cd server
npm run dev
```

Backend: http://localhost:3001

### Frontend Başlat:

```bash
# Yeni terminal
npm run dev
```

Frontend: http://localhost:5173

## 🌐 Coolify Deploy

### 1. Frontend Deploy (Vite)

```yaml
# Coolify'de yeni proje oluştur
# Repository: GitHub repository'niz
# Build Command: npm run build
# Publish Directory: dist
# Environment Variables:
#   - VITE_API_KEY: [Gemini API key]
#   - VITE_API_URL: [Backend URL, örn: https://api.zamanmakinesi.com]
```

### 2. Backend Deploy (Node.js)

```yaml
# Coolify'de yeni proje oluştur
# Repository: GitHub repository'niz
# Build Command: npm install && npm run build
# Start Command: npm start
# Environment Variables:
#   - DATABASE_URL: [Neon PostgreSQL URL]
#   - JWT_SECRET: [Güçlü bir secret]
#   - JWT_EXPIRES_IN: 7d
#   - FRONTEND_URL: [Frontend URL, örn: https://zamanmakinesi.com]
#   - GOOGLE_CLIENT_ID: [Google OAuth Client ID]
#   - GOOGLE_CLIENT_SECRET: [Google OAuth Client Secret]
#   - STRIPE_SECRET_KEY: [Stripe Secret Key]
#   - STRIPE_WEBHOOK_SECRET: [Stripe Webhook Secret]
#   - PORT: 3001
```

### 3. Veritabanı Migration (Production)

```bash
# Coolify terminal veya SSH üzerinden
cd /app
npm run migrate
```

## 🔑 API Endpoints

### Auth
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi (token gerekli)
- `GET /api/auth/google` - Google ile giriş başlat
- `GET /api/auth/google/callback` - Google callback

### Credits
- `GET /api/credits` - Kullanıcının kredi bilgisi (token gerekli)
- `POST /api/credits/add` - Kredi ekle (admin only)

### Payments
- `GET /api/packages` - Kredi paketleri (public)
- `POST /api/payments/create-checkout` - Checkout session oluştur (token gerekli)
- `POST /api/payments/webhook` - Stripe webhook (public)
- `GET /api/payments` - Kullanıcının ödemeleri (token gerekli)
- `POST /api/image/use-credit` - Görsel üretimi için kredi kullan (token gerekli)

### Admin
- `GET /api/admin/dashboard` - Dashboard istatistikleri (admin)
- `GET /api/admin/users` - Tüm kullanıcılar (admin)
- `DELETE /api/admin/users/:id` - Kullanıcı sil (admin)
- `GET /api/admin/users/:id/activities` - Kullanıcı aktiviteleri (admin)
- `GET /api/admin/activities` - Tüm aktiviteler (admin)
- `GET /api/admin/payments` - Tüm ödemeler (admin)
- `PUT /api/admin/packages/:id` - Paket güncelle/ekle (admin)
- `DELETE /api/admin/packages/:id` - Paket sil (admin)
- `GET /api/admin/settings` - Sistem ayarları (admin)
- `PUT /api/admin/settings` - Ayarları güncelle (admin)

## 🎨 Frontend Sayfaları

- `/` - Ana uygulama (görsel üretimi)
- `/login` - Giriş sayfası
- `/admin` - Admin paneli (admin users only)
- `/pricing` - Paket satın alma (opsiyonel)
- `/auth/google/callback?token=xxx` - Google OAuth callback
- `/payment/success?payment_id=xxx` - Ödeme başarılı
- `/payment/cancel?payment_id=xxx` - Ödeme iptal

## 🔐 Güvenlik Notları

1. **JWT Secret**: Production'da güçlü ve rastgele bir secret kullanın
2. **Database URL**: Environment variable olarak saklayın, koda yazmayın
3. **Stripe Keys**: Test modunda başlayın, production'a geçerken live keys kullanın
4. **Google OAuth**: Redirect URL'yi production domain'ne göre güncelleyin
5. **HTTPS**: Production'da HTTPS zorunludur

## 🔔 Stripe Webhook URL'si

Stripe'de webhook oluştururken şu URL'i kullanın:

### Local Development (Tunnel gerekli):
```
http://localhost:3001/api/payments/webhook
```

**Not:** Stripe, localhost'a webhook gönderemez. Tunnel kullanmalısınız:
```bash
# Ngrok ile tunnel oluştur
ngrok http 3001

# Stripe webhook URL'i: https://xxx.ngrok.io/api/payments/webhook
```

### Production:
```
https://your-backend-domain.com/api/payments/webhook
```

**Örnekler:**
- Coolify: `https://zamanmakinesi-api.vercel.app/api/payments/webhook`
- Render: `https://zamanmakinesi.onrender.com/api/payments/webhook`
- AWS: `https://api.zamanmakinesi.com/api/payments/webhook`

### Stripe'de Webhook Oluşturma:

1. **Stripe Dashboard'a git:** https://dashboard.stripe.com/test/webhooks
2. **"Add endpoint" butonuna tıkla**
3. **Webhook URL'yi yapıştır:**
   - Local: `https://xxx.ngrok.io/api/payments/webhook`
   - Production: `https://your-domain.com/api/payments/webhook`
4. **Event'leri seç:**
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.expired`
5. **"Add endpoint"e tıkla**
6. **Webhook Secret'i kopyala:** `whsec_...` ile başlar
7. **`.env` dosyasına ekle:**
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxx
   ```

### Webhook Test (Local):
```bash
# Stripe CLI ile test et
stripe login
stripe trigger checkout.session.completed --add checkout.session
```

## 📊 Veritabanı Şeması

```
users: id, email, password_hash, is_admin, credits, created_at
credit_packages: id, credits, price_try, is_active
payments: id, user_id, package_id, stripe_payment_intent_id, amount_eur, amount_try, status
user_activities: id, user_id, action_type, credits_used, description, metadata, created_at
system_settings: key, value, updated_at
```

## 🐛 Hata Ayıklama

### Backend çalışmıyor:
```bash
# Logları kontrol et
cd server
npm run dev

# Environment variables doğru mu kontrol et
cat .env

# Database bağlantısını test et
node -e "const pool = require('./dist/config/database.js').pool; pool.query('SELECT NOW()', (e, r) => console.log(r || e))"
```

### Frontend bağlanamıyor:
```bash
# Backend URL doğru mu?
# .env dosyasındaki VITE_API_URL kontrol et

# CORS enabled mi?
# server/src/index.ts'de cors settings kontrol et
```

### Stripe webhook çalışmıyor:
```bash
# Stripe CLI ile test et
stripe login
stripe listen --forward-to localhost:3001/api/payments/webhook
```

## 📝 Lisans

Apache-2.0
