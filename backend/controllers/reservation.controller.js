// backend/controllers/reservation.controller.js
// FINAL VERSION — MERGED, CLEAN, NO ERRORS, 90-MIN OVERLAP + ALL ORIGINAL FUNCTIONS

const Reservation = require('../models/reservation.model');

// =======================
// 90-MINUTE OVERLAP LOGIC
// =======================
const RESERVATION_DURATION_MINUTES = 90;

const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const doTimesOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

// GET AVAILABLE TABLES WITH REAL OVERLAP DETECTION
const getAvailableTables = async (req, res) => {
  try {
    const { date, timeSlot, guests } = req.query;

    if (!date || !timeSlot || !guests) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const requestedStart = timeToMinutes(timeSlot);
    const requestedEnd = requestedStart + RESERVATION_DURATION_MINUTES;

    // Find all active reservations on this date
    const allReservations = await Reservation.find({
      date,
      status: { $ne: 'Cancelled' }
    });

    // Find all tables that are booked during overlapping time
    const bookedTables = new Set();
    for (const res of allReservations) {
      const bookedStart = timeToMinutes(res.timeSlot);
      const bookedEnd = bookedStart + RESERVATION_DURATION_MINUTES;

      if (doTimesOverlap(requestedStart, requestedEnd, bookedStart, bookedEnd)) {
        bookedTables.add(res.tableNumber);
      }
    }

    // Your restaurant tables (you can move this to a Table model later)
    const allTables = [
      { number: 1,   capacity: 2 },
      { number: 2,   capacity: 2 },
      { number: 3,   capacity: 4 },
      { number: 4,   capacity: 6 },
      { number: 5,   capacity: 6 },
      { number: 6,   capacity: 8 },
      { number: 7,   capacity: 10 },
      { number: 101, capacity: 12, isVIP: true },
      { number: 102, capacity: 15, isVIP: true },
    ];

    const available = allTables
      .filter(t => t.capacity >= Number(guests) && !bookedTables.has(t.number))
      .map(t => ({ ...t, status: 'available' }));

    const reserved = allTables
      .filter(t => bookedTables.has(t.number))
      .map(t => ({ ...t, status: 'reserved' }));

    const tooSmall = allTables
      .filter(t => t.capacity < Number(guests))
      .map(t => ({ ...t, status: 'too-small' }));

    const tables = [...available, ...reserved, ...tooSmall]
      .sort((a, b) => a.number - b.number);

    res.json({
      date,
      timeSlot,
      guests: Number(guests),
      tables
    });

  } catch (err) {
    console.error("getAvailableTables error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// ORIGINAL FUNCTIONS (REQUIRED!)
// =======================

const getReservations = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== 'admin') filter.userID = req.user._id;
    const reservations = await Reservation.find(filter)
      .populate('userID', 'name email')
      .sort({ createdAt: -1 });
    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createReservation = async (req, res) => {
  try {
    const { date, timeSlot, guests, tableNumber, specialRequest, paymentMethod } = req.body;
    const userID = req.user._id;

    if (!date || !timeSlot || !guests || !tableNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const reservation = await Reservation.create({
      userID,
      date,
      timeSlot,
      guests,
      tableNumber,
      specialRequest,
      paymentMethod,
      status: "Confirmed"
    });

    res.status(201).json({ reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ message: 'Not found' });

    if (req.user.role !== 'admin' && !reservation.userID.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
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
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const patchStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!reservation) return res.status(404).json({ message: 'Not found' });
    res.json({ reservation });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// =======================
// EXPORT EVERYTHING
// =======================
module.exports = {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  patchStatus,
  getAvailableTables
};