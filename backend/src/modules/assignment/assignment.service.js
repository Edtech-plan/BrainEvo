const Assignment = require('./assignment.model');

class AssignmentService {
  async findAll() {
    return await Assignment.find().populate('course', 'title');
  }

  async findById(id) {
    return await Assignment.findById(id).populate('course', 'title');
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
