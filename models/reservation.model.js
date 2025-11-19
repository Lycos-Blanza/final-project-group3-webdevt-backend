// models/reservation.model.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tableNumber: { 
    type: String, 
    required: true 
  }, // ← NOW STRING: "T1", "VIP1", etc. (matches frontend)
  date: { type: String, required: true }, // "2025-11-19"
  timeSlot: { type: String, required: true }, // "18:30"
  guests: { type: Number, required: true },
  specialRequest: String,
  paymentMethod: String,
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], 
    default: 'Pending' 
  },
  rating: { type: Number, min: 1, max: 5 },
  feedback: String
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);