// backend/models/restaurant.model.js
const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  }
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'DINER28'
  },
  contact: String,
  capacity: {
    type: Number,
    default: 50
  },
  timeSlots: [String],
  tables: [tableSchema]  // ← correct sub-document schema
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);