const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/role.middleware');
const ctrl = require('../controllers/contact.controller');

router.post('/', auth, ctrl.createContact);
router.get('/', auth, ctrl.getContacts);
router.patch('/:id/:status', auth, permit('admin'), ctrl.updateContactStatus);
router.delete('/:id', auth, permit('admin'), ctrl.deleteContact);

module.exports = router;
