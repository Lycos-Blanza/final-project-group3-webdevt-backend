const Restaurant = require('../models/restaurant.model');

const getTables = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne();
    if (!restaurant) {
      restaurant = await Restaurant.create({
        name: "DINER28",
        tables: [
          { tableNumber: "T1", capacity: 2 },
          { tableNumber: "T2", capacity: 4 },
          { tableNumber: "T3", capacity: 4 },
          { tableNumber: "T4", capacity: 6 },
          { tableNumber: "T5", capacity: 6 },
          { tableNumber: "T6", capacity: 8 },
          { tableNumber: "T7", capacity: 10 },
          { tableNumber: "VIP1", capacity: 12 },
          { tableNumber: "VIP2", capacity: 15 },
        ]
      });
    }
    res.json({ tables: restaurant.tables || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTables };