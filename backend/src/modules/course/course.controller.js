const courseService = require('./course.service');

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await courseService.findAll();
    res.json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    next(error);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const course = await courseService.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const course = await courseService.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const course = await courseService.update(req.params.id, req.body);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await courseService.delete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    next(error);
  }
};
