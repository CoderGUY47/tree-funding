const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Payment = require('../models/Payment');
const Report = require('../models/Report');
const Notification = require('../models/Notification');

// Helper to create notifications
const createNotification = async (message, toEmail, actionRoute) => {
  try {
    const notification = new Notification({
      message,
      toEmail,
      actionRoute,
      time: new Date(),
      read: false
    });
    await notification.save();
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};

const getAdminStats = async (req, res) => {
  try {
    const supporterCount = await User.countDocuments({ role: 'Supporter' });
    const creatorCount = await User.countDocuments({ role: 'Creator' });

    // Sum of all users' credits
    const creditAggregate = await User.aggregate([
      { $group: { _id: null, totalCredits: { $sum: '$credits' } } }
    ]);
    const totalAvailableCredits = creditAggregate.length > 0 ? creditAggregate[0].totalCredits : 0;

    // Sum and count of payments processed
    const paymentAggregate = await Payment.aggregate([
      { $group: { _id: null, totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    const totalPaymentsVolume = paymentAggregate.length > 0 ? paymentAggregate[0].totalAmount : 0;
    const totalPaymentsCount = paymentAggregate.length > 0 ? paymentAggregate[0].count : 0;

    res.status(200).json({
      supporters: supporterCount,
      creators: creatorCount,
      totalCredits: totalAvailableCredits,
      totalPaymentsProcessed: totalPaymentsVolume,
      totalPaymentsCount: totalPaymentsCount
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error fetching administrator statistics.' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error fetching user directory.' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['Supporter', 'Creator', 'Admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selection.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.role = role;
    await user.save();

    // Notify user of role change
    await createNotification(
      `Your account role has been updated to ${role} by the administrator.`,
      user.email,
      '/dashboard'
    );

    res.status(200).json({ message: 'User role updated successfully.', user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error updating user role.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User removed from server successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error removing user.' });
  }
};

const reportCampaign = async (req, res) => {
  try {
    const { campaignId, reason } = req.body;

    if (!campaignId || !reason) {
      return res.status(400).json({ message: 'Campaign ID and reason for report are required.' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    const reporter = await User.findById(req.user.id);
    if (!reporter) {
      return res.status(404).json({ message: 'Reporter profile not found.' });
    }

    const report = new Report({
      campaignId: campaign._id,
      campaignTitle: campaign.title,
      reporterEmail: reporter.email,
      reporterName: reporter.name,
      reason
    });

    await report.save();

    // Notify admins
    const admins = await User.find({ role: 'Admin' });
    for (const admin of admins) {
      await createNotification(
        `Campaign '${campaign.title}' has been reported as suspicious by ${reporter.name}.`,
        admin.email,
        '/dashboard/admin'
      );
    }

    res.status(201).json({ message: 'Report submitted successfully.', report });

  } catch (error) {
    console.error('Report campaign error:', error);
    res.status(500).json({ message: 'Server error filing report.' });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({}).sort({ createdAt: -1 });
    res.status(200).json({ reports });
  } catch (error) {
    console.error('Get all reports error:', error);
    res.status(500).json({ message: 'Server error fetching reports.' });
  }
};

const deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Report cleared successfully.' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ message: 'Server error clearing report.' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  reportCampaign,
  getAllReports,
  deleteReport
};
