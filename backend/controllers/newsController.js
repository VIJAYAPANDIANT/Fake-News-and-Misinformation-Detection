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

// @desc    Analyze headline for clickbait and emotional indicators
// @route   POST /api/news/analyze-headline
// @access  Private
exports.analyzeHeadline = async (req, res, next) => {
  try {
    const { headline } = req.body;

    if (!headline || headline.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Headline is required' });
    }

    const trimmed = headline.trim();
    
    // 1. Capitalization score
    const words = trimmed.split(/\s+/);
    const uppercaseWords = words.filter(w => w.length > 1 && w === w.toUpperCase() && /^[A-Z]+$/.test(w));
    const capRatio = words.length > 0 ? (uppercaseWords.length / words.length) * 100 : 0;

    // 2. Sensational word check
    const sensationalPhrases = [
      "won't believe", "wont believe", "shocking", "mind-blowing", "mind blowing", "incredible",
      "you need to", "you will never", "never believe", "secret", "revealed", "viral", "amazing",
      "must watch", "obliterates", "destroys", "isolated incident", "omg", "shocked", "epic"
    ];
    let matchedPhrases = [];
    const lowerHeadline = trimmed.toLowerCase();
    sensationalPhrases.forEach(phrase => {
      if (lowerHeadline.includes(phrase)) {
        matchedPhrases.push(phrase);
      }
    });

    // 3. Exclamations / Question marks
    const hasExclamation = trimmed.includes('!');
    const hasQuestion = trimmed.includes('?');

    // 4. Starts with a number
    const startsWithNumber = /^\d+/.test(trimmed);

    // Calculate score
    let clickbaitScore = 0;
    if (capRatio > 25) clickbaitScore += 30;
    if (matchedPhrases.length > 0) clickbaitScore += Math.min(matchedPhrases.length * 25, 50);
    if (hasExclamation) clickbaitScore += 15;
    if (startsWithNumber) clickbaitScore += 10;
    if (hasQuestion && matchedPhrases.length > 0) clickbaitScore += 10; // "Is this true?"

    // Cap clickbait score at 100
    clickbaitScore = Math.min(clickbaitScore, 100);

    // Determine risk rating
    let risk = 'Low';
    if (clickbaitScore > 60) {
      risk = 'High';
    } else if (clickbaitScore > 30) {
      risk = 'Medium';
    }

    res.status(200).json({
      success: true,
      data: {
        headline: trimmed,
        clickbaitScore,
        risk,
        metrics: {
          capitalizationRatio: Math.round(capRatio),
          sensationalWordsFound: matchedPhrases,
          hasExclamation,
          hasQuestion,
          startsWithNumber
        }
      }
    });
  } catch (err) {
    next(err);
  }
};
