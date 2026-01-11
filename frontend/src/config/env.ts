/**
 * Environment Configuration
 */
export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
