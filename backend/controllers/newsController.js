const Prediction = require('../models/Prediction');
const { getMLPrediction } = require('../services/mlService');

// @desc    Predict whether news is Fake or Real
// @route   POST /api/news/predict
// @access  Private
exports.predictNews = async (req, res, next) => {
  try {
    const { title, text } = req.body;

    // Input Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide the article text to analyze.',
      });
    }

    // Call FastAPI Service
    const mlResponse = await getMLPrediction(title, text);

    // Save history in MongoDB
    const predictionRecord = await Prediction.create({
      userId: req.user.id,
      title: title || '',
      newsText: text,
      prediction: mlResponse.prediction,
      confidenceScore: mlResponse.confidenceScore,
    });

    res.status(200).json({
      success: true,
      data: {
        id: predictionRecord._id,
        title: predictionRecord.title,
        prediction: predictionRecord.prediction,
        confidenceScore: predictionRecord.confidenceScore,
        createdAt: predictionRecord.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's prediction history
// @route   GET /api/news/history
// @access  Private
exports.getHistory = async (req, res, next) => {
  try {
    const history = await Prediction.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit feedback on prediction
// @route   POST /api/news/feedback
// @access  Private
exports.submitFeedback = async (req, res, next) => {
  try {
    const { predictionId, feedback } = req.body;
    const Feedback = require('../models/Feedback');

    if (!predictionId || !feedback) {
      return res.status(400).json({ success: false, error: 'Prediction ID and feedback text are required.' });
    }

    const feedbackRecord = await Feedback.create({
      userId: req.user.id,
      predictionId,
      feedback,
    });

    res.status(201).json({
      success: true,
      data: feedbackRecord,
    });
  } catch (err) {
    next(err);
  }
};
