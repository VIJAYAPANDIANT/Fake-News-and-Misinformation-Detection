const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    predictionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prediction',
      required: [true, 'Prediction ID is required'],
      index: true,
    },
    feedback: {
      type: String,
      required: [true, 'Feedback text is required'],
      trim: true,
      minlength: [3, 'Feedback must be at least 3 characters'],
      maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user checking feedback on specific predictions
feedbackSchema.index({ userId: 1, predictionId: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);
const { createModelProxy, MockFeedback } = require('./mockDb');
module.exports = createModelProxy(Feedback, MockFeedback);
