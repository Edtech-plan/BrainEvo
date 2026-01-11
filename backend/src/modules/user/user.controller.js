const userService = require('./user.service');

/**
 * Get all users
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.findAll();
    res.json({ success: true, count: users.length, data: users });
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
