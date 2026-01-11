const Enrollment = require('../enrollment/enrollment.model');
const Course = require('../course/course.model');
const Assignment = require('../assignment/assignment.model');
const Submission = require('../submission/submission.model');

class AnalyticsService {
  async getDashboard() {
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    return {
      totalCourses,
      totalEnrollments,
      totalAssignments,
      totalSubmissions,
    };
  }

  async getCourseAnalytics(courseId) {
    const enrollments = await Enrollment.countDocuments({ course: courseId });
    const assignments = await Assignment.countDocuments({ course: courseId });
    const assignmentIds = await Assignment.find({ course: courseId }).distinct('_id');
    const submissions = await Submission.countDocuments({
      assignment: { $in: assignmentIds },
    });

    return {
      enrollments,
      assignments,
      submissions,
    };
  }
}

module.exports = new AnalyticsService();
