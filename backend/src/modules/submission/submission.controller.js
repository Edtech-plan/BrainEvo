const submissionService = require('./submission.service');

// --- FILE UPLOAD FEATURE CLOSED FOR NOW ---
// exports.uploadFile = async (req, res, next) => {
//   try {
//     if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
//     const fileUrl = `/uploads/${req.file.filename}`; // or S3 URL
//     res.json({ success: true, fileUrl });
//   } catch (err) { next(err); }
// };

function handleError(err, res, next) {
  if (err.statusCode) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  next(err);
}

exports.create = async (req, res, next) => {
  try {
    const { assignmentId, content, fileUrl, linkUrl } = req.body;
    const submission = await submissionService.create(req.user.id, assignmentId, {
      content,
      fileUrl,
      linkUrl,
    });
    res.status(201).json({ success: true, data: submission });
  } catch (err) {
    handleError(err, res, next);
  }
};

exports.getMySubmission = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const submission = await submissionService.findByAssignmentAndStudent(
      assignmentId,
      req.user.id
    );
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    res.json({ success: true, data: submission });
  } catch (err) {
    next(err);
  }
};

exports.getByAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await submissionService.findByAssignment(assignmentId);
    res.json({ success: true, count: submissions.length, data: submissions });
  } catch (err) {
    next(err);
  }
};

exports.grade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { score, feedback } = req.body;
    const submission = await submissionService.updateGrade(id, { score, feedback });
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    res.json({ success: true, data: submission });
  } catch (err) {
    next(err);
  }
};
