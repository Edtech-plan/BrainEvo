const express = require('express');
const { body } = require('express-validator');
const { create, verify, getByOrganization, delete: deleteInvitation } = require('./invitation.controller');
const { auth } = require('../../guards/auth.guard');
const validate = require('../../utils/validate');

const router = express.Router();

// @route   GET /api/invitations/verify
// @desc    Verify invitation token (public route)
router.get('/verify', verify);

// All other routes require authentication
router.use(auth);

// @route   POST /api/invitations
// @desc    Create invitation
router.post(
  '/',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('role').isIn(['learner', 'teacher']).withMessage('Role must be either learner or teacher'),
    body('organizationId').notEmpty().withMessage('Organization ID is required'),
  ],
  validate,
  create
);

// @route   GET /api/invitations/organization/:organizationId
// @desc    Get invitations by organization
router.get('/organization/:organizationId', getByOrganization);

// @route   DELETE /api/invitations/:id
// @desc    Delete invitation
router.delete('/:id', deleteInvitation);

module.exports = router;
