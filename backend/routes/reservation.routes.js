// routes/reservation.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/role.middleware');
const ctrl = require('../controllers/reservation.controller');

// All routes below require login
router.use(auth);

// Customer routes
router.get('/', ctrl.getReservations);                    // → user's own reservations
router.post('/', ctrl.createReservation);                 // → create new
router.put('/:id', ctrl.updateReservation);                // → edit own reservation
router.delete('/:id', ctrl.deleteReservation);             // → cancel own reservation

// Global availability (used by booking page to prevent double-booking)
router.get('/all', ctrl.getAllReservations);               // ← NEW: All active bookings

// Optional: keep your old endpoint (still works for other uses)
router.get('/availability', ctrl.getAvailableTables);

// Admin only
router.patch('/:id/:status', permit('admin'), ctrl.patchStatus);

module.exports = router;