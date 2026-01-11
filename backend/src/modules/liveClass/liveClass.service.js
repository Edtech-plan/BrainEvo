const LiveClass = require('./liveClass.model');

class LiveClassService {
  async findAll() {
    return await LiveClass.find()
      .populate('course', 'title')
      .populate('instructor', 'name email');
  }

  async findById(id) {
    return await LiveClass.findById(id)
      .populate('course', 'title')
      .populate('instructor', 'name email');
  }

  async create(liveClassData) {
    return await LiveClass.create(liveClassData);
  }

  async update(id, liveClassData) {
    return await LiveClass.findByIdAndUpdate(id, liveClassData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await LiveClass.findByIdAndDelete(id);
  }
}

module.exports = new LiveClassService();
