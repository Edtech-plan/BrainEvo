const Enrollment = require('./enrollment.model');
const Course = require('../course/course.model');
const User = require('../user/user.model');

class EnrollmentService {
  async enroll(studentId, courseId, enrolledBy) {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    const student = await User.findById(studentId);
    if (!student) throw new Error('Student not found');
    if (student.role !== 'learner') throw new Error('Only learners can be enrolled');

    const existing = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existing) throw new Error('Student is already enrolled in this course');

    return await Enrollment.create({
      student: studentId,
      course: courseId,
      status: 'active',
    });
  }

  async unenroll(enrollmentId) {
    const enrollment = await Enrollment.findByIdAndDelete(enrollmentId);
    return enrollment;
  }

  async findByCourse(courseId, { page = 1, limit = 20, skip = 0 } = {}) {
    const query = Enrollment.find({ course: courseId })
      .populate('student', 'name email')
      .sort({ enrolledAt: -1 });
    const total = await Enrollment.countDocuments({ course: courseId });
    const data = await query.skip(skip).limit(limit).lean();
    return { data, total };
  }

  async findByStudent(studentId, { page = 1, limit = 20, skip = 0 } = {}) {
    const query = Enrollment.find({ student: studentId })
      .populate({ path: 'course', select: 'title instructor', populate: { path: 'instructor', select: 'name' } })
      .sort({ enrolledAt: -1 });
    const total = await Enrollment.countDocuments({ student: studentId });
    const data = await query.skip(skip).limit(limit).lean();
    return { data, total };
  }

  async findById(id) {
    return await Enrollment.findById(id)
      .populate('student', 'name email')
      .populate('course', 'title');
  }

  async updateStatus(id, status) {
    const valid = ['active', 'completed', 'dropped'];
    if (!valid.includes(status)) throw new Error('Invalid status');
    return await Enrollment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }
}

module.exports = new EnrollmentService();
