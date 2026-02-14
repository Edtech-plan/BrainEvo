const express = require('express');
const { body } = require('express-validator');
const {
  enroll,
  unenroll,
  getByCourse,
  getMyEnrollments,
  updateStatus,
} = require('./enrollment.controller');
const { auth, authorize } = require('../../guards/auth.guard');
const validate = require('../../utils/validate');

const router = express.Router();

router.use(auth);

// @route   GET /api/enrollments/me
// @desc    Get current user's enrollments
router.get('/me', getMyEnrollments);

// @route   GET /api/enrollments/course/:courseId
// @desc    Get enrollments for a course (teacher/admin)
router.get('/course/:courseId', authorize('teacher', 'organization_admin'), getByCourse);

// @route   POST /api/enrollments
// @desc    Enroll student in course (teacher/admin)
router.post(
  '/',
  authorize('teacher', 'organization_admin'),
  [
    body('studentId').notEmpty().withMessage('Student ID is required'),
    body('courseId').notEmpty().withMessage('Course ID is required'),
  ],
  validate,
  enroll
);

// @route   PUT /api/enrollments/:id/status
// @desc    Update enrollment status (teacher/admin)
router.put(
  '/:id/status',
  authorize('teacher', 'organization_admin'),
  [body('status').isIn(['active', 'completed', 'dropped']).withMessage('Invalid status')],
  validate,
  updateStatus
);

// @route   DELETE /api/enrollments/:id
// @desc    Unenroll student (teacher/admin)
router.delete('/:id', authorize('teacher', 'organization_admin'), unenroll);

module.exports = router;
