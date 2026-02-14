const enrollmentService = require('./enrollment.service');
const { parsePagination, paginatedResponse } = require('../../utils/pagination');

exports.enroll = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.body;
    const enrollment = await enrollmentService.enroll(studentId, courseId, req.user.id);
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    next(error);
  }
};

exports.unenroll = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.unenroll(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    res.json({ success: true, message: 'Student unenrolled' });
  } catch (error) {
    next(error);
  }
};

exports.getByCourse = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { data, total } = await enrollmentService.findByCourse(req.params.courseId, { page, limit, skip });
    res.json({ success: true, ...paginatedResponse(data, total, page, limit) });
  } catch (error) {
    next(error);
  }
};

exports.getMyEnrollments = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { data, total } = await enrollmentService.findByStudent(req.user.id, { page, limit, skip });
    res.json({ success: true, ...paginatedResponse(data, total, page, limit) });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.updateStatus(req.params.id, req.body.status);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    res.json({ success: true, data: enrollment });
  } catch (error) {
    next(error);
  }
};
