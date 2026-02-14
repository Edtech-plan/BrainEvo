const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userService = require('../user/user.service');
const PasswordResetToken = require('./passwordResetToken.model');
const { JWT_SECRET } = require('../../config/env');

const RESET_TOKEN_EXPIRY_HOURS = 1;

/**
 * Auth Service
 * Business logic for authentication
 */
class AuthService {
  async forgotPassword(email) {
    const user = await userService.findByEmail(email);
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await PasswordResetToken.deleteMany({ user: user._id });
    await PasswordResetToken.create({
      user: user._id,
      token,
      expiresAt,
    });

    return {
      message: 'If the email exists, a reset link has been sent',
      token,
      expiresAt,
    };
  }

  async resetPassword(token, newPassword) {
    const resetRecord = await PasswordResetToken.findOne({ token }).populate('user');
    if (!resetRecord) {
      throw new Error('Invalid or expired reset token');
    }
    if (new Date() > resetRecord.expiresAt) {
      await PasswordResetToken.deleteOne({ token });
      throw new Error('Reset token has expired');
    }

    const user = await userService.findById(resetRecord.user._id);
    if (!user) {
      throw new Error('User not found');
    }

    user.password = newPassword;
    await user.save();

    await PasswordResetToken.deleteOne({ token });

    return { message: 'Password has been reset successfully' };
  }
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
