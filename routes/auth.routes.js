const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware'); // <-- this protects the /me route

router.post('/register', register);
router.post('/login', login);

// Protected route – returns current logged-in user
router.get('/me', auth, me);

module.exports = router;