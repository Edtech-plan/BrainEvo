const settingsService = require('./settings.service');

exports.getSettings = async (req, res, next) => {
  try {
    const data = await settingsService.getSettings(req.user.id);
    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const data = await settingsService.updateProfile(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.updateAppearance = async (req, res, next) => {
  try {
    const data = await settingsService.updateAppearance(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    const data = await settingsService.updateAccount(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.updateNotifications = async (req, res, next) => {
  try {
    const data = await settingsService.updateNotifications(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
