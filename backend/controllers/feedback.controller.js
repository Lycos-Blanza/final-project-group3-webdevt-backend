const Feedback = require('../models/feedback.model');

const createFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating) return res.status(400).json({ message: 'Rating required' });

    const feedback = await Feedback.create({ userID: req.user._id, rating, comment });
    res.status(201).json({ feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getFeedback = async (req, res) => {
  try {
    // optional restaurantID param support in case you extend model later
    const { restaurantID } = req.params;
    const filter = {};
    if (restaurantID) filter.restaurantID = restaurantID;
    const feedbacks = await Feedback.find(filter).populate('userID','name');
    res.json({ feedbacks });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createFeedback, getFeedback };
