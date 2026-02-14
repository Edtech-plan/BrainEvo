const express = require('express');
const { body } = require('express-validator');
const {
  getBatches,
  getBatch,
  createBatch,
  getBatchStudents,
  getBatchResources,
  getBatchStats,
  addResource,
  deleteResource,
  addStudent,
  removeStudent,
} = require('./batch.controller');
const { auth, authorize } = require('../../guards/auth.guard');
const validate = require('../../utils/validate');

const router = express.Router();

router.use(auth);
router.use(authorize('teacher', 'organization_admin'));

router.get('/', getBatches);
router.get('/:id', getBatch);
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Batch name is required'),
    body('startDate').notEmpty().withMessage('Start date is required'),
  ],
  validate,
  createBatch
);

router.get('/:id/students', getBatchStudents);
router.post(
  '/:id/students',
  [body('studentId').notEmpty().withMessage('Student ID is required')],
  validate,
  addStudent
);
router.delete('/:id/students/:studentId', removeStudent);

router.get('/:id/resources', getBatchResources);
router.get('/:id/stats', getBatchStats);

router.post(
  '/:id/resources',
  [
    body('title').trim().notEmpty().withMessage('Resource title is required'),
    body('url').optional().trim(),
    body('type').optional().isIn(['pdf', 'video', 'link', 'assignment']),
    body('size').optional().trim(),
  ],
  validate,
  addResource
);

router.delete('/:id/resources/:resourceId', deleteResource);

module.exports = router;
