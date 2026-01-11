import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  console.log('🚀 Migration başlatılıyor...');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Users tablosu
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        google_id VARCHAR(255) UNIQUE,
        is_admin BOOLEAN DEFAULT FALSE,
        credits INTEGER DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ users tablosu oluşturuldu');

    // Credit packages tablosu
    await client.query(`
      CREATE TABLE IF NOT EXISTS credit_packages (
        id SERIAL PRIMARY KEY,
        credits INTEGER NOT NULL,
        price_try DECIMAL(10,2) NOT NULL,
        stripe_price_id VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ credit_packages tablosu oluşturuldu');

    // Payments tablosu
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        package_id INTEGER REFERENCES credit_packages(id),
        amount_eur DECIMAL(10,2),
        amount_try DECIMAL(10,2) NOT NULL,
        stripe_payment_intent_id VARCHAR(255) UNIQUE,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ payments tablosu oluşturuldu');

    // User activities tablosu
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action_type VARCHAR(50) NOT NULL,
        credits_used INTEGER DEFAULT 0,
        description TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ user_activities tablosu oluşturuldu');

    // System settings tablosu
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);
    console.log('✅ system_settings tablosu oluşturuldu');

    // İlk verileri ekle
    const packageCount = await client.query('SELECT COUNT(*) FROM credit_packages');
    if (parseInt(packageCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO credit_packages (credits, price_try) VALUES
        (50, 500.00),
        (100, 1000.00),
        (250, 1500.00)
      `);
      console.log('✅ İlk kredi paketleri eklendi');
    }

    // Sistem ayarları
    const settingCount = await client.query('SELECT COUNT(*) FROM system_settings');
    if (parseInt(settingCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO system_settings (key, value) VALUES
        ('free_credits_on_signup', '10')
      `);
      console.log('✅ Sistem ayarları eklendi');
    }

    // Admin kullanıcısı oluştur
    const adminExists = await client.query('SELECT * FROM users WHERE email = $1', ['admin@zamanmakinasi.app']);
    if (adminExists.rows.length === 0) {
      const adminPassword = await bcrypt.hash('admin12345', 10);
      await client.query(`
        INSERT INTO users (email, password_hash, is_admin, credits)
        VALUES ($1, $2, TRUE, 999999)
      `, ['admin@zamanmakinasi.app', adminPassword]);
      console.log('✅ Admin kullanıcısı oluşturuldu');
      console.log('   Email: admin@zamanmakinasi.app');
      console.log('   Şifre: admin12345');
      console.log('   ⚠️  Lütfen production ortamında şifreyi değiştirin!');
    }

    await client.query('COMMIT');
    console.log('🎉 Migration başarıyla tamamlandı!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration hatası:', error);
    throw error;
  } finally {
    client.release();
  }
}

migrate()
  .then(() => {
    pool.end();
    process.exit(0);
  })
  .catch((error) => {
    pool.end();
    console.error(error);
    process.exit(1);
  });
