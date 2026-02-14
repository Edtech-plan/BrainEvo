const Course = require('./course.model');

class CourseService {
  async findAll({ page = 1, limit = 20, skip = 0 } = {}) {
    const query = Course.find().populate('instructor', 'name email');
    const total = await Course.countDocuments();
    const courses = await query.skip(skip).limit(limit).lean();
    return { data: courses, total };
  }

  async findById(id) {
    return await Course.findById(id).populate('instructor', 'name email');
  }

  async create(courseData) {
    return await Course.create(courseData);
  }

  async update(id, courseData) {
    return await Course.findByIdAndUpdate(id, courseData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Course.findByIdAndDelete(id);
  }
}

module.exports = new CourseService();
