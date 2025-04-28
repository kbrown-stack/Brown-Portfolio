const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Send contact message
router.post('/', contactController.sendMessage);

// Get all messages (admin)
router.get('/', contactController.getAllMessages);

// Get unread messages count
router.get('/unread', contactController.getUnreadCount);

// Mark message as read
router.put('/:id/read', contactController.markAsRead);

module.exports = router;