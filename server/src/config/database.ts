import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Neon PostgreSQL için gerekli
  },
});

// Veritabanı bağlantısını test et
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL bağlantısı başarılı');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL bağlantı hatası:', error);
    return false;
  }
};

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

export const getClient = async (): Promise<PoolClient> => {
  return await pool.connect();
};

export default pool;
