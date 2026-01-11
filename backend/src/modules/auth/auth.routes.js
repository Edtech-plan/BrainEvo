const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('./auth.controller');
const { auth } = require('../../guards/auth.guard');
const validate = require('../../utils/validate');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
router.post(
  '/register',
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
