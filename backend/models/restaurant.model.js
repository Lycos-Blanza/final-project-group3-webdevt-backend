const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, default: 'My Restaurant' },
  contact: { type: String },
  capacity: { type: Number, default: 50 },
  timeSlots: [{ type: String }], // e.g. ["11:00", "11:30", ...]
  tables: [{
    tableNumber: Number,
    capacity: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
