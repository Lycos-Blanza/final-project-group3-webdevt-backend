const Restaurant = require('../models/restaurant.model');

const getRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne();
    if (!restaurant) {
      // create default
      restaurant = await Restaurant.create({
        name: 'My Restaurant',
        timeSlots: ['11:00', '11:30', '12:00', '12:30', '18:00', '18:30'],
        capacity: 50
      });
    }
    res.json({ restaurant });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const data = req.body;
    let restaurant = await Restaurant.findOne();
    if (!restaurant) {
      restaurant = await Restaurant.create(data);
    } else {
      restaurant = await Restaurant.findByIdAndUpdate(restaurant._id, data, { new: true });
    }
    res.json({ restaurant });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getRestaurant, updateRestaurant };
