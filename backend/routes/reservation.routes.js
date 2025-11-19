const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/role.middleware');
const ctrl = require('../controllers/reservation.controller');

router.use(auth);

router.get('/', ctrl.getReservations);
router.post('/', ctrl.createReservation);
router.put('/:id', ctrl.updateReservation);
router.delete('/:id', ctrl.deleteReservation);
router.get('/availability', ctrl.getAvailableTables);

// Admin-only status patch
router.patch('/:id/:status', permit('admin'), ctrl.patchStatus);

module.exports = router;
