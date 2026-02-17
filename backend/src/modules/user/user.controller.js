const userService = require('./user.service');
const { parsePagination, paginatedResponse } = require('../../utils/pagination');

/**
 * Get all users
 */
exports.getUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { data, total } = await userService.findAll({ page, limit, skip });
    res.json({ success: true, ...paginatedResponse(data, total, page, limit) });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single user
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 */
exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.update(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await userService.delete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
