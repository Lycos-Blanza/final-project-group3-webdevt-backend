// backend/controllers/reservation.controller.js
const Reservation = require("../models/reservation.model");
const Restaurant = require("../models/restaurant.model");

// === 90-MINUTE OVERLAP LOGIC ===
const RESERVATION_DURATION_MINUTES = 90;

const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const doTimesOverlap = (startMinutes1, startMinutes2) => {
  const end1 = startMinutes1 + RESERVATION_DURATION_MINUTES;
  const end2 = startMinutes2 + RESERVATION_DURATION_MINUTES;
  return startMinutes1 < end2 && startMinutes2 < end1;
};

// === GET ALL ACTIVE RESERVATIONS (GLOBAL – FOR BOOKING PAGE) ===
const getAllReservations = async (req, res) => {
  try {
    // Only logged-in users can see this (security + prevents abuse)
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const reservations = await Reservation.find({
      status: { $ne: "Cancelled" },
    })
      .select("-__v -createdAt -updatedAt") // clean response
      .lean();

    res.json({ reservations });
  } catch (err) {
    console.error("getAllReservations error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// === GET AVAILABLE TABLES (optional – you can keep this too) ===
const getAvailableTables = async (req, res) => {
  try {
    const { date, timeSlot, guests } = req.query;

    if (!date || !timeSlot || !guests) {
      return res
        .status(400)
        .json({ message: "Missing required fields: date, timeSlot, guests" });
    }

    const requestedMinutes = timeToMinutes(timeSlot);

    const activeReservations = await Reservation.find({
      date,
      status: { $in: ["Pending", "Confirmed"] },
    });

    const bookedTableNumbers = new Set();
    for (const res of activeReservations) {
      const bookedMinutes = timeToMinutes(res.timeSlot);
      if (doTimesOverlap(requestedMinutes, bookedMinutes)) {
        bookedTableNumbers.add(res.tableNumber);
      }
    }

    const restaurant = await Restaurant.findOne();
    const tables = restaurant?.tables || [];

    const availableTables = tables.map((table) => {
      const tableNum = table.tableNumber;
      const isBooked = bookedTableNumbers.has(tableNum);
      const isTooSmall = table.capacity < Number(guests);

      return {
        number: tableNum,
        capacity: table.capacity,
        available: !isBooked && !isTooSmall,
        status: isBooked ? "reserved" : isTooSmall ? "too-small" : "available",
      };
    });

    res.json({
      date,
      timeSlot,
      guests: Number(guests),
      tables: availableTables,
    });
  } catch (err) {
    console.error("getAvailableTables error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// === GET USER'S RESERVATIONS ===
const getReservations = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { userID: req.user._id };
    const reservations = await Reservation.find(filter)
      .populate("userID", "name email")
      .sort({ createdAt: -1 });

    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// === CREATE RESERVATION ===
const createReservation = async (req, res) => {
  try {
    const {
      date,
      timeSlot,
      guests,
      tableNumber,
      specialRequest,
      paymentMethod,
    } = req.body;
    const userID = req.user._id;

    if (!date || !timeSlot || !guests || !tableNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const reservation = await Reservation.create({
      userID,
      date,
      timeSlot,
      guests: Number(guests),
      tableNumber,
      specialRequest: specialRequest?.trim(),
      paymentMethod,
      status: "Pending", // Changed to Pending – admin approves
    });

    res.status(201).json({ reservation });
  } catch (err) {
    console.error("createReservation error:", err);
    res.status(500).json({ message: "Failed to create reservation" });
  }
};

// === UPDATE RESERVATION ===
const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const reservation = await Reservation.findById(id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    if (req.user.role !== "admin" && !reservation.userID.equals(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await Reservation.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.json({ reservation: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// === DELETE/CANCEL RESERVATION ===
const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ message: "Not found" });

    if (req.user.role !== "admin" && !reservation.userID.equals(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Reservation.findByIdAndDelete(id);
    res.json({ message: "Reservation cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// === ADMIN: PATCH STATUS ===
const patchStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    if (!["Pending", "Confirmed", "Cancelled", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    res.json({ reservation });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// EXPORT ALL
module.exports = {
  getReservations,
  getAllReservations, // ← NOW EXPORTED!
  createReservation,
  updateReservation,
  deleteReservation,
  patchStatus,
  getAvailableTables,
};
