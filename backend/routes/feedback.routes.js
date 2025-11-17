const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/feedback.controller');

router.post('/', auth, ctrl.createFeedback);
router.get('/:restaurantID?', ctrl.getFeedback);

module.exports = router;
