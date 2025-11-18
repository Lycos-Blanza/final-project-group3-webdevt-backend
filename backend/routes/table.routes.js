const express = require('express');
const router = express.Router();
const { getTables } = require('../controllers/table.controller');

router.get('/', getTables);

module.exports = router;