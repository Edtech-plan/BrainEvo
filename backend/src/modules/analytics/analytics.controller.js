const analyticsService = require('./analytics.service');

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
