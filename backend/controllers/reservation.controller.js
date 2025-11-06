const Reservation = require('../models/reservation.model');
const Restaurant = require('../models/restaurant.model');

// check availability helper (basic)
const isSlotAvailable = async ({ restaurantID, date, timeSlot, guests }) => {
  // Basic check: ensure no reservation exists with same date/time and guests overlaps.
  const start = new Date(date);
  start.setHours(0,0,0,0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const conflict = await Reservation.findOne({
    restaurantID,
    date: { $gte: start, $lt: end },
    timeSlot,
    status: { $ne: 'Cancelled' }
  });
  return !conflict;
};

const createReservation = async (req, res) => {
  try {
    const { restaurantID, date, timeSlot, guests } = req.body;
    const userID = req.user._id;

    if (!date || !timeSlot || !guests) return res.status(400).json({ message: 'Missing fields' });

    const ok = await isSlotAvailable({ restaurantID, date, timeSlot, guests });
    if (!ok) return res.status(409).json({ message: 'Slot already reserved' });

    const reservation = await Reservation.create({ userID, restaurantID, date, timeSlot, guests });
    res.status(201).json({ reservation });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getReservations = async (req, res) => {
  try {
    // admin: all; customer: own reservations
    const filter = {};
    if (req.user.role !== 'admin') filter.userID = req.user._id;
    const reservations = await Reservation.find(filter).populate('userID', 'name email').sort({ createdAt: -1 });
    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ message: 'Not found' });

    // if non-admin, only owner can modify and only if status is Pending
    if (req.user.role !== 'admin' && !reservation.userID.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // If changing time/date, check availability
    if ((update.date && update.timeSlot) || (update.date) || (update.timeSlot)) {
      const ok = await isSlotAvailable({
        restaurantID: reservation.restaurantID,
        date: update.date || reservation.date,
        timeSlot: update.timeSlot || reservation.timeSlot,
        guests: update.guests || reservation.guests
      });
      if (!ok) return res.status(409).json({ message: 'Slot already reserved' });
    }

    const updated = await Reservation.findByIdAndUpdate(id, update, { new: true });
    res.json({ reservation: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ message: 'Not found' });

    if (req.user.role !== 'admin' && !reservation.userID.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Reservation.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const patchStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    if (!['Pending','Confirmed','Cancelled'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const reservation = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
    if (!reservation) return res.status(404).json({ message: 'Not found' });
    res.json({ reservation });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createReservation, getReservations, updateReservation, deleteReservation, patchStatus };
