const express = require('express');
const { body } = require('express-validator');
const { create, getById, getMyOrganization, update, getMembers } = require('./organization.controller');
const { auth } = require('../../guards/auth.guard');
const validate = require('../../utils/validate');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   POST /api/organizations
// @desc    Create organization
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Organization name is required'),
    body('contactEmail').isEmail().withMessage('Please provide a valid contact email'),
  ],
  validate,
  create
);

// @route   GET /api/organizations/me
// @desc    Get current user's organization
router.get('/me', getMyOrganization);

// @route   GET /api/organizations/:id
// @desc    Get organization by ID
router.get('/:id', getById);

// @route   PUT /api/organizations/:id
// @desc    Update organization
router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Organization name cannot be empty'),
    body('contactEmail').optional().isEmail().withMessage('Please provide a valid contact email'),
  ],
  validate,
  update
);

// @route   GET /api/organizations/:id/members
// @desc    Get organization members
router.get('/:id/members', getMembers);

module.exports = router;
