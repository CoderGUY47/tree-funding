const express = require('express');
const router = express.Router();
const { getUserNotifications, markNotificationAsRead, markAllAsRead } = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, getUserNotifications);
router.patch('/mark-all', verifyToken, markAllAsRead);
router.patch('/:id', verifyToken, markNotificationAsRead);

module.exports = router;
