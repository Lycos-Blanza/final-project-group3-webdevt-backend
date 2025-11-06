const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantID: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  guests: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  paid: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
