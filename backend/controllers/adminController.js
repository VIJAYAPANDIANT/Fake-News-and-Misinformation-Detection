const User = require('../models/User');
const Prediction = require('../models/Prediction');

// @desc    Get dashboard statistics for Admin
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPredictions = await Prediction.countDocuments();
    
    // Aggregation for breakdown of Fake vs Real predictions
    const predictionsBreakdown = await Prediction.aggregate([
      {
        $group: {
          _id: '$prediction',
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      totalUsers,
      totalPredictions,
      breakdown: {
        Real: 0,
        Fake: 0,
      },
    };

    predictionsBreakdown.forEach((group) => {
      if (group._id === 'Real') stats.breakdown.Real = group.count;
      if (group._id === 'Fake') stats.breakdown.Fake = group.count;
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin Only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a prediction record
// @route   DELETE /api/admin/predictions/:id
// @access  Private (Admin Only)
exports.deletePrediction = async (req, res, next) => {
  try {
    const prediction = await Prediction.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({ success: false, error: 'Prediction record not found' });
    }

    await prediction.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Prediction record removed successfully',
    });
  } catch (err) {
    next(err);
  }
};
