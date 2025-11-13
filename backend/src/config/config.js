const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const env = process.env.NODE_ENV || 'development';

module.exports = {
  env,
  isProduction: env === 'production',
  port: Number(process.env.PORT || 5000),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'change_me_now',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change_me_refresh',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d'
  },
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'helpdesk_lite',
    connectionLimit: Number(process.env.DB_POOL_LIMIT || 10)
  }
};

