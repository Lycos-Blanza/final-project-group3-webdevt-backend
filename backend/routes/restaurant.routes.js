const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/role.middleware');
const ctrl = require('../controllers/restaurant.controller');

router.get('/', ctrl.getRestaurant);
router.put('/', auth, permit('admin'), ctrl.updateRestaurant);

module.exports = router;
