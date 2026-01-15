const invitationService = require('./invitation.service');

/**
 * Create invitation
 */
exports.create = async (req, res, next) => {
  try {
    const invitation = await invitationService.createInvitation({
      ...req.body,
      invitedBy: req.user.id,
    });
    res.status(201).json({ success: true, invitation });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify invitation token
 */
exports.verify = async (req, res, next) => {
  try {
    const { token } = req.query;
    const invitation = await invitationService.verifyInvitation(token);
    res.json({ success: true, invitation });
  } catch (error) {
    next(error);
  }
};

/**
 * Get invitations by organization
 */
exports.getByOrganization = async (req, res, next) => {
  try {
    const invitations = await invitationService.getInvitationsByOrganization(req.params.organizationId);
    res.json({ success: true, invitations });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete invitation
 */
exports.delete = async (req, res, next) => {
  try {
    await invitationService.deleteInvitation(req.params.id);
    res.json({ success: true, message: 'Invitation deleted successfully' });
  } catch (error) {
    next(error);
  }
};
