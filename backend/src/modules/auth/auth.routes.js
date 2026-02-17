const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { register, login, getMe, forgotPassword, resetPassword } = require('./auth.controller');
const { auth } = require('../../guards/auth.guard');
const validate = require('../../utils/validate');

const router = express.Router();

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset (sends token - integrate email service for production)
router.post(
  '/forgot-password',
  authRateLimiter,
  [body('email').isEmail().withMessage('Please provide a valid email')],
  validate,
  forgotPassword
);

// @route   POST /api/auth/reset-password
// @desc    Reset password using token
router.post(
  '/reset-password',
  authRateLimiter,
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  resetPassword
);

// @route   POST /api/auth/register
// @desc    Register user
router.post(
  '/register',
  authRateLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

// @route   POST /api/auth/login
// @desc    Login user
router.post(
  '/login',
  authRateLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', auth, getMe);

module.exports = router;
