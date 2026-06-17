const express = require('express');
const { getStats, getAllUsers, deletePrediction } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth protection & admin authorization to all sub-routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/predictions/:id', deletePrediction);

module.exports = router;
