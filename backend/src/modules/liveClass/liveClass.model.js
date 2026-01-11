const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    default: 60,
  },
  meetingLink: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('LiveClass', liveClassSchema);
