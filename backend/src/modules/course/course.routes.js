const express = require('express');
const { body } = require('express-validator');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('./course.controller');
const { auth, authorize } = require('../../guards/auth.guard');
const validate = require('../../utils/validate');

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourse);

router.use(auth);

router.post(
  '/',
  authorize('teacher', 'organization_admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
  ],
  validate,
  createCourse
);

router.put('/:id', authorize('teacher', 'organization_admin'), updateCourse);
router.delete('/:id', authorize('teacher', 'organization_admin'), deleteCourse);

module.exports = router;
