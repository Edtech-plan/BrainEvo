const User = require('./user.model');

/**
 * User Service
 * Business logic for user operations
 */
class UserService {
  async findAll() {
    return await User.find().select('-password');
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, userData) {
    return await User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
    }).select('-password');
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = new UserService();
