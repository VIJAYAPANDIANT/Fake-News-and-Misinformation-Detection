const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true, // Index for user lookup
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    newsText: {
      type: String,
      required: [true, 'News text is required'],
      trim: true,
    },
    prediction: {
      type: String,
      enum: {
        values: ['Real', 'Fake'],
        message: '{VALUE} is not a valid prediction label'
      },
      required: [true, 'Prediction result is required'],
    },
    confidenceScore: {
      type: Number,
      required: [true, 'Confidence score is required'],
      min: [0, 'Confidence score cannot be less than 0'],
      max: [1, 'Confidence score cannot exceed 1'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user history lookup sorted by creation date
predictionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);
