const Enrollment = require('../enrollment/enrollment.model');
const Course = require('../course/course.model');
const Assignment = require('../assignment/assignment.model');
const Submission = require('../submission/submission.model');
const User = require('../user/user.model');
const LiveClass = require('../liveClass/liveClass.model');
const BatchEnrollment = require('../batch/batchEnrollment.model');

class AnalyticsService {
  async getTeacherDashboard(userId, organizationId) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const [totalStudents, pendingCount, liveClasses, recentSubmissions, avgAttendance] = await Promise.all([
      organizationId
        ? User.countDocuments({ organizationId, role: 'learner' })
        : 0,
      Submission.countDocuments({ score: { $exists: false }, gradedAt: null }),
      LiveClass.find({ instructor: userId })
        .populate('course', 'title')
        .sort({ scheduledAt: 1 })
        .lean(),
      Submission.find()
        .populate('student', 'name')
        .populate('assignment', 'title')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      BatchEnrollment.aggregate([
        { $group: { _id: null, avg: { $avg: '$attendanceRate' } } },
      ]).then((r) => (r[0]?.avg ? Math.round(r[0].avg) : 85)),
    ]);

    const todaySchedule = liveClasses
      .filter((lc) => {
        const start = new Date(lc.scheduledAt);
        return start >= todayStart && start < todayEnd;
      })
      .map((lc) => ({
        id: lc._id.toString(),
        title: lc.title,
        batchName: lc.course?.title || 'Class',
        startTime: new Date(lc.scheduledAt).toISOString(),
        endTime: new Date(new Date(lc.scheduledAt).getTime() + (lc.duration || 60) * 60000).toISOString(),
        status: 'SCHEDULED',
      }));

    const nextClass =
      liveClasses.find((lc) => new Date(lc.scheduledAt) > now) || null;
    const nextClassFormatted = nextClass
      ? {
          id: nextClass._id.toString(),
          title: nextClass.title,
          batchName: nextClass.course?.title || 'Class',
          startTime: new Date(nextClass.scheduledAt).toISOString(),
          endTime: new Date(
            new Date(nextClass.scheduledAt).getTime() + (nextClass.duration || 60) * 60000
          ).toISOString(),
          status: 'SCHEDULED',
        }
      : null;

    const activities = recentSubmissions.map((s) => ({
      id: s._id.toString(),
      user: s.student?.name || 'Student',
      action: 'submitted',
      target: s.assignment?.title || 'Assignment',
      timestamp: s.createdAt?.toISOString?.() || new Date().toISOString(),
      type: 'submission',
    }));

    return {
      stats: {
        pendingAssignments: pendingCount,
        avgAttendance: avgAttendance || 85,
        studentEngagement: 92,
        totalStudents: totalStudents || 0,
      },
      activities,
      nextClass: nextClassFormatted,
      todaySchedule,
    };
  }

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
