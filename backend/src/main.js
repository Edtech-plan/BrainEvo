const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./database/database');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./filters/http-exception.filter');

// Connect to database (for non-serverless environments)
// In Vercel serverless, connection is handled per-request via middleware
if (process.env.VERCEL !== '1') {
  connectDB().catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
}

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection middleware for serverless (Vercel)
// Ensures DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Logging middleware
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server only if not running on Vercel
// Vercel handles the server automatically
if (process.env.VERCEL !== '1') {
  const PORT = env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });
}

module.exports = app;
