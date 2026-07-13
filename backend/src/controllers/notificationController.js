const Notification = require('../models/Notification');

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ toEmail: req.user.email })
      .sort({ time: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Get user notifications error:', error);
    res.status(500).json({ message: 'Server error fetching notifications.' });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    if (notification.toEmail !== req.user.email) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read.', notification });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Server error updating notification status.' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ toEmail: req.user.email, read: false }, { read: true });
    res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ message: 'Server error updating notifications.' });
  }
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  markAllAsRead
};
