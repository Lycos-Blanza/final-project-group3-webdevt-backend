// controllers/table.controller.js
const Restaurant = require("../models/restaurant.model");

const getTables = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne();
    if (!restaurant || !restaurant.tables || restaurant.tables.length === 0) {
      // Seed default tables
      restaurant = await Restaurant.findOneAndUpdate(
        { name: "DINER28" },
        {
          $set: {
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
            ],
          },
        },
        { upsert: true, new: true }
      );
    }

    const tables = restaurant.tables.map((t) => ({
      _id: t._id,
      number: t.tableNumber,
      capacity: t.capacity,
    }));

    res.json({ tables });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addTable = async (req, res) => {
  // Future admin route
};

module.exports = { getTables };
