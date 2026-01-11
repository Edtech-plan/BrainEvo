const Course = require('./course.model');

class CourseService {
  async findAll() {
    return await Course.find().populate('instructor', 'name email');
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
