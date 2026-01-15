const express = require('express');
const { body } = require('express-validator');
const {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} = require('./assignment.controller');
const { auth, authorize } = require('../../guards/auth.guard');
const validate = require('../../utils/validate');

const router = express.Router();

router.get('/', getAssignments);
router.get('/:id', getAssignment);

router.use(auth);

router.post(
  '/',
  authorize('teacher', 'organization_admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('dueDate').isISO8601().withMessage('Due date must be a valid date'),
  ],
  validate,
  createAssignment
);

router.put('/:id', authorize('teacher', 'organization_admin'), updateAssignment);
router.delete('/:id', authorize('teacher', 'organization_admin'), deleteAssignment);

module.exports = router;
