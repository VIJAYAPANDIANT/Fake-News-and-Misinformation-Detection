const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin ID is required'],
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Admin action description is required'],
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    // We only use standard custom timestamps/dates here
    timestamps: false,
  }
);

module.exports = mongoose.model('AdminLog', adminLogSchema);
