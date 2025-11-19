const Contact = require('../models/contact.model');

const createContact = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const userID = req.user?._id || null;

    if (!subject || !message) return res.status(400).json({ message: 'Missing fields' });

    const contact = await Contact.create({ userID, subject, message });
    res.status(201).json({ contact });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getContacts = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== 'admin') filter.userID = req.user._id;
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.json({ contacts });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateContactStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    const allowed = ['Pending','Replied','Resolved'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ contact });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createContact, getContacts, updateContactStatus, deleteContact };
