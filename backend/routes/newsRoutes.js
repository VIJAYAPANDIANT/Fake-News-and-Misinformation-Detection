const express = require('express');
const { predictNews, getHistory, submitFeedback } = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/predict', protect, predictNews);
router.get('/history', protect, getHistory);
router.post('/feedback', protect, submitFeedback);

module.exports = router;
