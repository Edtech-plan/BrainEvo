const express = require('express');
const path = require('path');
const multer = require('multer');
const { body } = require('express-validator');
const { create, getMySubmission, getByAssignment, grade, uploadFile } = require('./submission.controller');
const { auth, authorize } = require('../../guards/auth.guard');
const validate = require('../../utils/validate');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || '';
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(pdf|doc|docx|txt|png|jpg|jpeg|zip)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: pdf, doc, docx, txt, png, jpg, jpeg, zip'));
    }
  },
});

router.use(auth);

// @route   POST /api/submissions/upload
// @desc    Upload file for submission, returns fileUrl
router.post('/upload', upload.single('file'), uploadFile);

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
