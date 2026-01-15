const Organization = require('./organization.model');
const User = require('../user/user.model');

/**
 * Organization Service
 * Business logic for organization management
 */
class OrganizationService {
  async create(organizationData) {
    const { name, adminId, contactEmail, contactPhone, address } = organizationData;

    // Check if organization with same name already exists
    const existingOrg = await Organization.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingOrg) {
      throw new Error('Organization with this name already exists');
    }

    // Create organization
    const organization = await Organization.create({
      name,
      adminId,
      contactEmail,
      contactPhone,
      address,
    });

    // Update admin user with organizationId
    await User.findByIdAndUpdate(adminId, { organizationId: organization._id });

    return organization;
  }

  async findById(id) {
    return await Organization.findById(id).populate('adminId', 'name email');
  }

  async findByAdminId(adminId) {
    return await Organization.findOne({ adminId });
  }

  async update(id, updateData) {
    return await Organization.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async getAll() {
    return await Organization.find({ isActive: true }).populate('adminId', 'name email');
  }

  async getMembers(organizationId) {
    return await User.find({ organizationId }).select('-password');
  }
}

module.exports = new OrganizationService();
