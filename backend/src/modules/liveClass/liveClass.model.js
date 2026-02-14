const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false, // Made optional
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false, // Made optional for personal events
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
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  recordingUrl: { type: String, required: false },
  notesUrl: { type: String, required: false },
  registeredStudents: { type: Number, default: 0 },
  actualAttendance: { type: Number, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('LiveClass', liveClassSchema);
