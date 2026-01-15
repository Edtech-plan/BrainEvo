const Invitation = require('./invitation.model');
const Organization = require('../organization/organization.model');
const User = require('../user/user.model');

/**
 * Invitation Service
 * Business logic for invitation management
 */
class InvitationService {
  async createInvitation(invitationData) {
    const { organizationId, email, role, invitedBy } = invitationData;

    // Check if organization exists
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      throw new Error('Organization not found');
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Check if there's already a valid invitation for this email and organization
    const existingInvitation = await Invitation.findOne({
      email,
      organizationId,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (existingInvitation) {
      throw new Error('An active invitation already exists for this email');
    }

    // Create invitation
    const invitation = await Invitation.create({
      organizationId,
      email,
      role,
      invitedBy,
    });

    return invitation;
  }

  async verifyInvitation(token) {
    const invitation = await Invitation.findOne({ token }).populate('organizationId');

    if (!invitation) {
      throw new Error('Invalid invitation token');
    }

    if (!invitation.isValid()) {
      throw new Error('Invitation has expired or has already been used');
    }

    return invitation;
  }

  async useInvitation(token, userId) {
    const invitation = await Invitation.findOne({ token });

    if (!invitation) {
      throw new Error('Invalid invitation token');
    }

    if (!invitation.isValid()) {
      throw new Error('Invitation has expired or has already been used');
    }

    // Mark invitation as used
    invitation.isUsed = true;
    invitation.usedAt = new Date();
    await invitation.save();

    // Update user with organization and role
    await User.findByIdAndUpdate(userId, {
      organizationId: invitation.organizationId,
      role: invitation.role,
    });

    return invitation;
  }

  async getInvitationsByOrganization(organizationId) {
    return await Invitation.find({ organizationId })
      .populate('invitedBy', 'name email')
      .sort({ createdAt: -1 });
  }

  async getInvitationByEmail(email, organizationId) {
    return await Invitation.findOne({ email, organizationId, isUsed: false })
      .populate('organizationId')
      .sort({ createdAt: -1 });
  }

  async deleteInvitation(invitationId) {
    return await Invitation.findByIdAndDelete(invitationId);
  }
}

module.exports = new InvitationService();
