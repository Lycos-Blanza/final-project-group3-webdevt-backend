const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  dateSent: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Replied', 'Resolved'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
