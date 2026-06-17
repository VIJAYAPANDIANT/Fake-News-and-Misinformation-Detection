const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Report description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'reviewed', 'resolved'],
        message: '{VALUE} is not a valid status'
      },
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
