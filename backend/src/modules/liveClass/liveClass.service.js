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

  async updateRecording(id, recordingUrl) {
    return await LiveClass.findByIdAndUpdate(
      id,
      { recordingUrl, status: 'completed' },
      { new: true, runValidators: true }
    )
      .populate('course', 'title')
      .populate('instructor', 'name email');
  }

  async getStats(instructorId) {
    const query = instructorId ? { instructor: instructorId } : {};
    const completed = await LiveClass.find({ ...query, status: 'completed' }).lean();
    const totalClasses = completed.length;
    const totalHours = completed.reduce((acc, lc) => acc + (lc.duration || 60) / 60, 0);
    const withAttendance = completed.filter((lc) => (lc.registeredStudents || 0) > 0);
    const avgAttendancePercentage =
      withAttendance.length > 0
        ? withAttendance.reduce(
            (acc, lc) =>
              acc + ((lc.actualAttendance || 0) / lc.registeredStudents) * 100,
            0
          ) / withAttendance.length
        : 0;

    return {
      totalClasses,
      totalHours: Math.round(totalHours * 10) / 10,
      avgAttendancePercentage: Math.round(avgAttendancePercentage),
    };
  }

  async delete(id) {
    return await LiveClass.findByIdAndDelete(id);
  }
}

module.exports = new LiveClassService();
