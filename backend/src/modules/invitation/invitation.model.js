const mongoose = require('mongoose');
const crypto = require('crypto');

const invitationSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['learner', 'teacher'],
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(32).toString('hex'),
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  usedAt: {
    type: Date,
    default: null,
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for faster lookups (token already has unique index from schema)
invitationSchema.index({ email: 1, organizationId: 1 });

// Check if invitation is valid
invitationSchema.methods.isValid = function() {
  return !this.isUsed && this.expiresAt > new Date();
};

module.exports = mongoose.model('Invitation', invitationSchema);
