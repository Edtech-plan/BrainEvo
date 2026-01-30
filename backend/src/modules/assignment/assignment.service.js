const Assignment = require('./assignment.model');
const Submission = require('../submission/submission.model');

function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  if (obj._id) obj.id = obj._id.toString();
  if (obj._id) delete obj._id;
  return obj;
}

function computeStatus(assignment, submission) {
  if (!submission) {
    return new Date(assignment.dueDate) > new Date() ? 'PENDING' : 'OVERDUE';
  }
  return submission.status === 'graded' ? 'GRADED' : 'SUBMITTED';
}

function mapMySubmission(submission) {
  if (!submission) return undefined;
  const sub = submission.toObject ? submission.toObject() : submission;
  return {
    id: sub._id.toString(),
    assignmentId: (sub.assignment && sub.assignment._id ? sub.assignment._id : sub.assignment).toString(),
    submittedAt: (sub.createdAt || new Date()).toISOString(),
    fileUrl: sub.fileUrl,
    linkUrl: sub.linkUrl,
    grade: sub.score,
    feedback: sub.feedback,
  };
}

class AssignmentService {
  async findAll() {
    return await Assignment.find().populate('course', 'title');
  }

  async findById(id) {
    return await Assignment.findById(id).populate('course', 'title');
  }

  async findAllForUser(userId) {
    const assignments = await Assignment.find()
      .populate({ path: 'course', select: 'title instructor', populate: { path: 'instructor', select: 'name' } });
    const submissions = await Submission.find({ student: userId }).populate('assignment');
    const subByAssignment = {};
    submissions.forEach((s) => {
      const aid = (s.assignment && s.assignment._id ? s.assignment._id : s.assignment).toString();
      subByAssignment[aid] = s;
    });
    return assignments.map((a) => {
      const obj = toPlain(a);
      const sub = subByAssignment[a._id.toString()];
      obj.status = computeStatus(a, sub);
      if (sub) obj.mySubmission = mapMySubmission(sub);
      if (obj.course) {
        obj.subject = obj.course.title;
        obj.instructorName = (obj.course.instructor && obj.course.instructor.name) || 'Instructor';
      }
      obj.pointsTotal = obj.maxScore;
      return obj;
    });
  }

  async findByIdForUser(id, userId) {
    const assignment = await Assignment.findById(id)
      .populate({ path: 'course', select: 'title instructor', populate: { path: 'instructor', select: 'name' } });
    if (!assignment) return null;
    const submission = await Submission.findOne({ assignment: id, student: userId });
    const obj = toPlain(assignment);
    obj.status = computeStatus(assignment, submission);
    if (submission) obj.mySubmission = mapMySubmission(submission);
    if (obj.course) {
      obj.subject = obj.course.title;
      obj.instructorName = (obj.course.instructor && obj.course.instructor.name) || 'Instructor';
    }
    obj.pointsTotal = obj.maxScore;
    return obj;
  }

  async create(assignmentData) {
    return await Assignment.create(assignmentData);
  }

  async update(id, assignmentData) {
    return await Assignment.findByIdAndUpdate(id, assignmentData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Assignment.findByIdAndDelete(id);
  }
}

module.exports = new AssignmentService();
