const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  days: { type: [String], default: [] },
  startTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '10:30' },
}, { _id: false });

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  schedule: {
    type: scheduleSchema,
    default: () => ({ days: [], startTime: '09:00', endTime: '10:30' }),
  },
  startDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active',
  },
}, {
  timestamps: true,
});

batchSchema.index({ organizationId: 1 });
batchSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Batch', batchSchema);
