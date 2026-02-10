const mongoose = require('mongoose');

const notificationChannelSchema = new mongoose.Schema({
  email: { type: Boolean, default: true },
  inApp: { type: Boolean, default: true },
}, { _id: false });

const quietHoursSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  start: { type: String, default: '22:00' },
  end: { type: String, default: '08:00' },
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  profile: {
    phone: { type: String, default: '' },
    headline: { type: String, default: '' },
    socialLinks: {
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
  },
  appearance: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
    editorFontSize: { type: Number, default: 14 },
    editorKeymap: { type: String, enum: ['vscode', 'vim', 'sublime'], default: 'vscode' },
  },
  account: {
    timezone: { type: String, default: 'Asia/Kolkata' },
    language: { type: String, default: 'en' },
  },
  notifications: {
    assignmentCreated: notificationChannelSchema,
    gradeReleased: notificationChannelSchema,
    liveClassReminders: notificationChannelSchema,
    announcements: { type: notificationChannelSchema, default: () => ({ email: false, inApp: true }) },
    quietHours: quietHoursSchema,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('UserSettings', settingsSchema);
