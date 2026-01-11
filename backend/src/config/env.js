require('dotenv').config();

/**
 * Environment Configuration
 * Loads and validates environment variables
 */

const env = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,

  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/brainevo',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',

  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

// Validate required environment variables in production
if (env.NODE_ENV === 'production') {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

module.exports = env;
