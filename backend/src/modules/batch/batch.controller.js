const batchService = require('./batch.service');
const { parsePagination, paginatedResponse } = require('../../utils/pagination');

exports.getBatches = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    if (!organizationId) {
      return res.status(400).json({ success: false, message: 'User not in an organization' });
    }
    const { page, limit, skip } = parsePagination(req.query);
    const { data, total } = await batchService.findAll(organizationId, { page, limit, skip });
    res.json({ success: true, ...paginatedResponse(data, total, page, limit) });
  } catch (error) {
    next(error);
  }
};

exports.getBatch = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const batch = await batchService.findById(req.params.id, organizationId);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, data: batch });
  } catch (error) {
    next(error);
  }
};

exports.createBatch = async (req, res, next) => {
  try {
    const batch = await batchService.create(req.body, req.user.id);
    res.status(201).json({ success: true, data: batch });
  } catch (error) {
    next(error);
  }
};

exports.getBatchStudents = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const students = await batchService.getStudents(req.params.id, organizationId);
    if (students === null) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};

exports.getBatchResources = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const resources = await batchService.getResources(req.params.id, organizationId);
    if (resources === null) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, data: resources });
  } catch (error) {
    next(error);
  }
};

exports.getBatchStats = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const stats = await batchService.getStats(req.params.id, organizationId);
    if (stats === null) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

exports.addResource = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { title, type, url, size } = req.body;
    const resource = await batchService.addResource(
      req.params.id,
      { title, type, url: url || '#', size: size || '' },
      req.user.id,
      organizationId
    );
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const deleted = await batchService.deleteResource(req.params.resourceId, organizationId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    next(error);
  }
};

exports.addStudent = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { studentId } = req.body;
    const student = await batchService.addStudent(req.params.id, studentId, organizationId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    if (error.message === 'Student not found' || error.message === 'Only learners can be added to batches' || error.message === 'Student must belong to the same organization' || error.message === 'Student is already in this batch') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

exports.removeStudent = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { id: batchId, studentId } = req.params;
    const removed = await batchService.removeStudent(batchId, studentId, organizationId);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    res.json({ success: true, message: 'Student removed from batch' });
  } catch (error) {
    next(error);
  }
};
