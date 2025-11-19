// models/reservation.model.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tableNumber: { type: Number, required: true }, // e.g., 1, 2, 3
  date: { type: String, required: true }, // "2025-11-19"
  timeSlot: { type: String, required: true }, // "06:30", "07:30"
  guests: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);