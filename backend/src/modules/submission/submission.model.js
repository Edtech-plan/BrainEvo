const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
  fileUrl: {
    type: String,
  },
  linkUrl: {
    type: String,
  },
  score: {
    type: Number,
    min: 0,
  },
  feedback: {
    type: String,
  },
  gradedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['submitted', 'graded', 'late'],
    default: 'submitted',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Submission', submissionSchema);
