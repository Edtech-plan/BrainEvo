const analyticsService = require('./analytics.service');

exports.getTeacherDashboard = async (req, res, next) => {
  try {
    const data = await analyticsService.getTeacherDashboard(
      req.user.id,
      req.user.organizationId?.toString()
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const data = await analyticsService.getDashboard();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getCourseAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getCourseAnalytics(req.params.courseId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
