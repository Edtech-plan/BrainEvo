const organizationService = require('./organization.service');

/**
 * Create organization
 */
exports.create = async (req, res, next) => {
  try {
    const organization = await organizationService.create({
      ...req.body,
      adminId: req.user.id,
    });
    res.status(201).json({ success: true, organization });
  } catch (error) {
    next(error);
  }
};

/**
 * Get organization by ID
 */
exports.getById = async (req, res, next) => {
  try {
    const organization = await organizationService.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json({ success: true, organization });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's organization
 */
exports.getMyOrganization = async (req, res, next) => {
  try {
    const organization = await organizationService.findByAdminId(req.user.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json({ success: true, organization });
  } catch (error) {
    next(error);
  }
};

/**
 * Update organization
 */
exports.update = async (req, res, next) => {
  try {
    const organization = await organizationService.update(req.params.id, req.body);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json({ success: true, organization });
  } catch (error) {
    next(error);
  }
};

/**
 * Get organization members
 */
exports.getMembers = async (req, res, next) => {
  try {
    const members = await organizationService.getMembers(req.params.id);
    res.json({ success: true, members });
  } catch (error) {
    next(error);
  }
};
