const express = require('express');
const { body } = require('express-validator');
const {
  getLiveClasses,
  getLiveClass,
  createLiveClass,
  updateLiveClass,
  deleteLiveClass,
} = require('./liveClass.controller');
const { auth, authorize } = require('../../guards/auth.guard');
const validate = require('../../utils/validate');

const router = express.Router();

router.get('/', getLiveClasses);
router.get('/:id', getLiveClass);

router.use(auth);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('scheduledAt').isISO8601().withMessage('Scheduled date must be a valid date'),
    body('meetingLink').trim().notEmpty().withMessage('Meeting link is required'),
  ],
  validate,
  createLiveClass
);

router.put('/:id', authorize('teacher', 'organization_admin'), updateLiveClass);
router.delete('/:id', authorize('teacher', 'organization_admin'), deleteLiveClass);

module.exports = router;
