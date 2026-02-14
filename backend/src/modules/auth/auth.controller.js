const authService = require('./auth.service');
const userService = require('../user/user.service');

/**
 * Register new user
 */
exports.register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * Login user
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ success: true, ...result });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * Forgot password - request reset token
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password - use token to set new password
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    res.json({ success: true, ...result });
  } catch (error) {
    if (error.message === 'Invalid or expired reset token' || error.message === 'Reset token has expired') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * Get current user
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await userService.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
