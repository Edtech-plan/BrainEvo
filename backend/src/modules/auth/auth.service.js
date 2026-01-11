const jwt = require('jsonwebtoken');
const userService = require('../user/user.service');
const { JWT_SECRET } = require('../../config/env');

/**
 * Auth Service
 * Business logic for authentication
 */
class AuthService {
  async register(userData) {
    const { name, email, password, role } = userData;

    // Check if user exists
    const userExists = await userService.findByEmail(email);
    if (userExists) {
      throw new Error('User already exists');
    }

    // Create user
    const user = await userService.create({ name, email, password, role });

    // Generate token
    const token = this.generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(email, password) {
    // Check if user exists
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET);
  }
}

module.exports = new AuthService();
