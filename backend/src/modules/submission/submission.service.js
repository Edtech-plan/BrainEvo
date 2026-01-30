const Submission = require('./submission.model');
const Assignment = require('../assignment/assignment.model');

class SubmissionService {
  async create(studentId, assignmentId, { content = '', fileUrl, linkUrl }) {
    const existing = await Submission.findOne({ assignment: assignmentId, student: studentId });
    if (existing) {
      const err = new Error('Already submitted for this assignment');
      err.statusCode = 400;
      throw err;
    }
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      const err = new Error('Assignment not found');
      err.statusCode = 404;
      throw err;
    }
    if (!content && !fileUrl && !linkUrl) {
      const err = new Error('Provide at least one of content, fileUrl, or linkUrl');
      err.statusCode = 400;
      throw err;
    }
    return await Submission.create({
      student: studentId,
      assignment: assignmentId,
      content: content || (linkUrl || ''),
      fileUrl: fileUrl || undefined,
      linkUrl: linkUrl || undefined,
      status: 'submitted',
    });
  }

  async findByAssignmentAndStudent(assignmentId, studentId) {
    return await Submission.findOne({ assignment: assignmentId, student: studentId })
      .populate('assignment', 'title dueDate maxScore');
  }

  async findByAssignment(assignmentId) {
    return await Submission.find({ assignment: assignmentId })
      .populate('student', 'name email')
      .populate('assignment', 'title dueDate maxScore')
      .sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Submission.findById(id)
      .populate('assignment', 'title dueDate maxScore')
      .populate('student', 'name email');
  }

  async updateGrade(id, { score, feedback }) {
    return await Submission.findByIdAndUpdate(
      id,
      { score, feedback, gradedAt: new Date(), status: 'graded' },
      { new: true, runValidators: true }
    )
      .populate('assignment', 'title dueDate maxScore')
      .populate('student', 'name email');
  }
}

module.exports = new SubmissionService();
