const express = require('express');
const { body } = require('express-validator');
const { create, getMySubmission, getByAssignment, grade } = require('./submission.controller');
const { auth, authorize } = require('../../guards/auth.guard');
const validate = require('../../utils/validate');

const router = express.Router();

router.use(auth);

// --- FILE UPLOAD FEATURE CLOSED FOR NOW ---
// When enabled: install multer, add upload middleware, and uncomment below.
// POST /upload would accept multipart/form-data file, store (e.g. to disk or S3), return { fileUrl }.
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
// router.post('/upload', upload.single('file'), (req, res) => { ... return fileUrl ... });

router.post(
  '/',
  [
    body('assignmentId').notEmpty().withMessage('Assignment ID is required'),
    body('content').optional().trim(),
    body('fileUrl').optional().isURL().withMessage('fileUrl must be a valid URL'),
    body('linkUrl').optional().trim(),
  ],
  validate,
  create
);

router.get('/assignment/:assignmentId/me', getMySubmission);
router.get('/assignment/:assignmentId', authorize('teacher', 'organization_admin'), getByAssignment);

router.put(
  '/:id/grade',
  authorize('teacher', 'organization_admin'),
  [
    body('score').optional().isNumeric().withMessage('Score must be a number'),
    body('feedback').optional().trim(),
  ],
  validate,
  grade
);

module.exports = router;
