const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
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

const createWithdrawalRequest = async (req, res) => {
  try {
    const { withdrawalCredit, paymentSystem, accountNumber } = req.body;
    const credits = Number(withdrawalCredit);

    if (isNaN(credits) || credits <= 0) {
      return res.status(400).json({ message: 'A valid number of credits to withdraw is required.' });
    }

    if (credits < 200) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is 200 credits ($10).' });
    }

    if (!paymentSystem || !accountNumber) {
      return res.status(400).json({ message: 'Payment system and account number are required.' });
    }

    // Fetch Creator User
    const creator = await User.findById(req.user.id);
    if (!creator) {
      return res.status(404).json({ message: 'Creator profile not found.' });
    }

    // Calculate pending withdrawals to avoid double withdrawal
    const pendingWithdrawals = await Withdrawal.find({
      creatorEmail: creator.email,
      status: 'pending'
    });

    const totalPendingCredits = pendingWithdrawals.reduce((sum, w) => sum + w.withdrawalCredit, 0);
    const availableToWithdraw = creator.credits - totalPendingCredits;

    if (credits > availableToWithdraw) {
      return res.status(400).json({
        message: `Insufficient credits. You have ${creator.credits} credits, with ${totalPendingCredits} locked in pending withdrawals. Maximum withdrawable: ${availableToWithdraw} credits.`
      });
    }

    // Calculate dollar amount: 20 credits = 1 Dollar
    const dollarAmount = credits / 20;

    const newWithdrawal = new Withdrawal({
      creatorEmail: creator.email,
      creatorName: creator.name,
      withdrawalCredit: credits,
      withdrawalAmount: dollarAmount,
      paymentSystem,
      accountNumber,
      status: 'pending'
    });

    await newWithdrawal.save();

    // Notify Admins
    const admins = await User.find({ role: 'Admin' });
    for (const admin of admins) {
      await createNotification(
        `New withdrawal request of $${dollarAmount} by Creator ${creator.name} is pending processing.`,
        admin.email,
        '/dashboard/admin'
      );
    }

    res.status(201).json({
      message: 'Withdrawal request submitted successfully, pending Admin processing.',
      withdrawal: newWithdrawal
    });

  } catch (error) {
    console.error('Create withdrawal request error:', error);
    res.status(500).json({ message: 'Server error requesting withdrawal.' });
  }
};

const getCreatorWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ creatorEmail: req.user.email }).sort({ createdAt: -1 });
    res.status(200).json({ withdrawals });
  } catch (error) {
    console.error('Get creator withdrawals error:', error);
    res.status(500).json({ message: 'Server error fetching withdrawal records.' });
  }
};

const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({}).sort({ createdAt: -1 });
    res.status(200).json({ withdrawals });
  } catch (error) {
    console.error('Get all withdrawals error:', error);
    res.status(500).json({ message: 'Server error fetching all withdrawals.' });
  }
};

const approveWithdrawalPayment = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal request not found.' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'This withdrawal has already been processed.' });
    }

    // Fetch creator user
    const creator = await User.findOne({ email: withdrawal.creatorEmail });
    if (!creator) {
      return res.status(404).json({ message: 'Creator account not found.' });
    }

    // Verify creator has enough credits to cover this
    if (creator.credits < withdrawal.withdrawalCredit) {
      return res.status(400).json({ message: 'Creator has insufficient credits to complete this withdrawal.' });
    }

    // Process: Approve withdrawal request & Deduct credits from Creator
    withdrawal.status = 'approved';
    await withdrawal.save();

    creator.credits -= withdrawal.withdrawalCredit;
    await creator.save();

    // Notify Creator
    await createNotification(
      `Your withdrawal request of ${withdrawal.withdrawalCredit} credits ($${withdrawal.withdrawalAmount}) was approved and processed via ${withdrawal.paymentSystem}.`,
      withdrawal.creatorEmail,
      '/dashboard/creator'
    );

    res.status(200).json({ message: 'Withdrawal payment processed successfully.', withdrawal, creatorCredits: creator.credits });

  } catch (error) {
    console.error('Approve withdrawal payment error:', error);
    res.status(500).json({ message: 'Server error processing withdrawal payout.' });
  }
};

module.exports = {
  createWithdrawalRequest,
  getCreatorWithdrawals,
  getAllWithdrawals,
  approveWithdrawalPayment
};
