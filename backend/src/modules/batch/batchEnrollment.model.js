const mongoose = require('mongoose');

const batchEnrollmentSchema = new mongoose.Schema({
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  attendanceRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ['active', 'at_risk', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

batchEnrollmentSchema.index({ batch: 1, student: 1 }, { unique: true });
batchEnrollmentSchema.index({ batch: 1 });

module.exports = mongoose.model('BatchEnrollment', batchEnrollmentSchema);
