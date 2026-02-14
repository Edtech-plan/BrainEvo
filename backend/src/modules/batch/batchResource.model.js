const mongoose = require('mongoose');

const batchResourceSchema = new mongoose.Schema({
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['pdf', 'video', 'link', 'assignment'],
    default: 'link',
  },
  url: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: '',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

batchResourceSchema.index({ batch: 1 });

module.exports = mongoose.model('BatchResource', batchResourceSchema);
