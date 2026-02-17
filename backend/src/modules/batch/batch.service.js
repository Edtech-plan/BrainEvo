const Batch = require('./batch.model');
const BatchEnrollment = require('./batchEnrollment.model');
const BatchResource = require('./batchResource.model');
const User = require('../user/user.model');

function toBatchResponse(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id.toString(),
    name: obj.name,
    schedule: obj.schedule || { days: [], startTime: '09:00', endTime: '10:30' },
    startDate: obj.startDate ? new Date(obj.startDate).toISOString().split('T')[0] : null,
    studentCount: obj.studentCount ?? 0,
    status: obj.status || 'active',
  };
}

function toStudentResponse(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  const student = obj.student || obj;
  const enrollment = obj.student ? obj : null;
  return {
    id: (student._id || obj._id).toString(),
    name: student.name || '',
    email: student.email || '',
    joinDate: (enrollment?.joinDate || obj.joinDate)
      ? new Date(enrollment?.joinDate || obj.joinDate).toISOString().split('T')[0]
      : '',
    attendanceRate: enrollment?.attendanceRate ?? obj.attendanceRate ?? 0,
    status: enrollment?.status || obj.status || 'active',
  };
}

function toResourceResponse(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id.toString(),
    title: obj.title,
    type: obj.type || 'link',
    url: obj.url,
    size: obj.size || '',
    uploadDate: obj.createdAt
      ? new Date(obj.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '',
    isPublished: obj.isPublished !== false,
  };
}

class BatchService {
  async findAll(organizationId, { page = 1, limit = 20, skip = 0 } = {}) {
    const query = Batch.find({ organizationId }).sort({ createdAt: -1 });
    const total = await Batch.countDocuments({ organizationId });
    const batches = await query.skip(skip).limit(limit).lean();

    const result = await Promise.all(
      batches.map(async (b) => {
        const count = await BatchEnrollment.countDocuments({ batch: b._id });
        return toBatchResponse({ ...b, studentCount: count });
      })
    );
    return { data: result, total };
  }

  async findById(id, organizationId) {
    const batch = await Batch.findById(id).lean();
    if (!batch) return null;
    if (organizationId && batch.organizationId.toString() !== organizationId.toString()) {
      return null;
    }
    const studentCount = await BatchEnrollment.countDocuments({ batch: batch._id });
    return toBatchResponse({ ...batch, studentCount });
  }

  async create(data, userId) {
    const { name, schedule, startDate } = data;
    const user = await User.findById(userId).select('organizationId');
    const organizationId = user?.organizationId || data.organizationId;
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }

    const batch = await Batch.create({
      name,
      schedule: schedule || { days: [], startTime: '09:00', endTime: '10:30' },
      startDate: startDate ? new Date(startDate) : new Date(),
      organizationId,
      createdBy: userId,
      status: 'active',
    });

    return toBatchResponse({ ...batch.toObject(), studentCount: 0 });
  }

  async getStudents(batchId, organizationId) {
    const batch = await Batch.findById(batchId);
    if (!batch) return null;
    if (organizationId && batch.organizationId.toString() !== organizationId.toString()) {
      return null;
    }

    const enrollments = await BatchEnrollment.find({ batch: batchId })
      .populate('student', 'name email')
      .sort({ joinDate: 1 })
      .lean();

    return enrollments.map((e) => toStudentResponse(e));
  }

  async getResources(batchId, organizationId) {
    const batch = await Batch.findById(batchId);
    if (!batch) return null;
    if (organizationId && batch.organizationId.toString() !== organizationId.toString()) {
      return null;
    }

    const resources = await BatchResource.find({ batch: batchId })
      .sort({ createdAt: -1 })
      .lean();

    return resources.map((r) => toResourceResponse(r));
  }

  async getStats(batchId, organizationId) {
    const batch = await Batch.findById(batchId);
    if (!batch) return null;
    if (organizationId && batch.organizationId.toString() !== organizationId.toString()) {
      return null;
    }

    const enrollments = await BatchEnrollment.find({ batch: batchId }).lean();
    const avgAttendance =
      enrollments.length > 0
        ? Math.round(
            enrollments.reduce((sum, e) => sum + (e.attendanceRate || 0), 0) / enrollments.length
          )
        : 0;

    return { avgAttendance, avgPerformance: avgAttendance };
  }

  async addResource(batchId, data, userId, organizationId) {
    const batch = await Batch.findById(batchId);
    if (!batch) return null;
    if (organizationId && batch.organizationId.toString() !== organizationId.toString()) {
      return null;
    }

    const resource = await BatchResource.create({
      batch: batchId,
      title: data.title,
      type: data.type || 'link',
      url: data.url || '#',
      size: data.size || '',
      uploadedBy: userId,
      isPublished: data.isPublished !== false,
    });

    return toResourceResponse(resource);
  }

  async deleteResource(resourceId, organizationId) {
    const resource = await BatchResource.findById(resourceId).populate('batch');
    if (!resource || !resource.batch) return null;
    if (organizationId && resource.batch.organizationId.toString() !== organizationId.toString()) {
      return null;
    }
    await BatchResource.findByIdAndDelete(resourceId);
    return true;
  }

  async addStudent(batchId, studentId, organizationId) {
    const batch = await Batch.findById(batchId);
    if (!batch) return null;
    if (organizationId && batch.organizationId.toString() !== organizationId.toString()) {
      return null;
    }

    const student = await User.findById(studentId);
    if (!student) throw new Error('Student not found');
    if (student.role !== 'learner') throw new Error('Only learners can be added to batches');
    if (student.organizationId?.toString() !== batch.organizationId.toString()) {
      throw new Error('Student must belong to the same organization');
    }

    const existing = await BatchEnrollment.findOne({ batch: batchId, student: studentId });
    if (existing) throw new Error('Student is already in this batch');

    const enrollment = await BatchEnrollment.create({
      batch: batchId,
      student: studentId,
      status: 'active',
    });

    const populated = await BatchEnrollment.findById(enrollment._id)
      .populate('student', 'name email')
      .lean();
    return toStudentResponse(populated);
  }

  async removeStudent(batchId, studentId, organizationId) {
    const batch = await Batch.findById(batchId);
    if (!batch) return null;
    if (organizationId && batch.organizationId.toString() !== organizationId.toString()) {
      return null;
    }

    const enrollment = await BatchEnrollment.findOneAndDelete({
      batch: batchId,
      student: studentId,
    });
    return !!enrollment;
  }
}

module.exports = new BatchService();
