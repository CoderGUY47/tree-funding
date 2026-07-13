const Contribution = require('../models/Contribution');
const Campaign = require('../models/Campaign');
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

const createContribution = async (req, res) => {
  try {
    const { campaignId, contributionAmount } = req.body;
    const amount = Number(contributionAmount);

    if (!campaignId || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Valid campaign ID and contribution amount are required.' });
    }

    // Find campaign
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    if (campaign.status !== 'approved') {
      return res.status(400).json({ message: 'You can only contribute to approved and active campaigns.' });
    }

    // Check deadline
    if (new Date(campaign.deadline) < new Date()) {
      return res.status(400).json({ message: 'Campaign deadline has passed.' });
    }

    // Check minimum contribution
    if (amount < campaign.minimumContribution) {
      return res.status(400).json({ message: `Minimum contribution for this campaign is ${campaign.minimumContribution} credits.` });
    }

    // Fetch Supporter
    const supporter = await User.findById(req.user.id);
    if (!supporter) {
      return res.status(404).json({ message: 'Supporter profile not found.' });
    }

    // Verify credits
    if (supporter.credits < amount) {
      return res.status(400).json({ message: 'Insufficient credits. Please purchase more credits first.' });
    }

    // DEDUCT credits immediately (locks them in pending status)
    supporter.credits -= amount;
    await supporter.save();

    // Create Contribution
    const newContribution = new Contribution({
      campaignId: campaign._id,
      campaignTitle: campaign.title,
      contributionAmount: amount,
      supporterEmail: supporter.email,
      supporterName: supporter.name,
      creatorEmail: campaign.creatorEmail,
      creatorName: campaign.creatorName,
      status: 'pending'
    });

    await newContribution.save();

    // Notify Creator
    await createNotification(
      `A new contribution of ${amount} credits was made to your campaign '${campaign.title}' by ${supporter.name}.`,
      campaign.creatorEmail,
      '/dashboard/creator'
    );

    // Notify Supporter
    await createNotification(
      `Your contribution of ${amount} credits to '${campaign.title}' is pending creator approval.`,
      supporter.email,
      '/dashboard/supporter'
    );

    res.status(201).json({
      message: 'Contribution submitted successfully, pending creator review.',
      contribution: newContribution,
      userCredits: supporter.credits
    });

  } catch (error) {
    console.error('Create contribution error:', error);
    res.status(500).json({ message: 'Server error placing contribution.' });
  }
};

const getSupporterContributions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Contribution.countDocuments({ supporterEmail: req.user.email });
    const contributions = await Contribution.find({ supporterEmail: req.user.email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      contributions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalContributions: total
    });
  } catch (error) {
    console.error('Get supporter contributions error:', error);
    res.status(500).json({ message: 'Server error fetching your contributions.' });
  }
};

const getCreatorContributions = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { creatorEmail: req.user.email };
    if (status) {
      query.status = status;
    }

    const contributions = await Contribution.find(query).sort({ createdAt: -1 });
    res.status(200).json({ contributions });
  } catch (error) {
    console.error('Get creator contributions error:', error);
    res.status(500).json({ message: 'Server error fetching campaign contributions.' });
  }
};

const approveContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (!contribution) {
      return res.status(404).json({ message: 'Contribution not found.' });
    }

    // Ensure belongs to creator
    if (contribution.creatorEmail !== req.user.email) {
      return res.status(403).json({ message: 'Unauthorized. You can only manage contributions for your own campaigns.' });
    }

    if (contribution.status !== 'pending') {
      return res.status(400).json({ message: 'This contribution has already been processed.' });
    }

    // Update status to approved
    contribution.status = 'approved';
    await contribution.save();

    // Increment Campaign's amount raised
    await Campaign.findByIdAndUpdate(
      contribution.campaignId,
      { $inc: { amountRaised: contribution.contributionAmount } }
    );

    // Notify Supporter (matching required format exactly)
    await createNotification(
      `Your Contribution of ${contribution.contributionAmount} credits to ${contribution.campaignTitle} was approved by ${contribution.creatorName}`,
      contribution.supporterEmail,
      '/dashboard/supporter'
    );

    res.status(200).json({ message: 'Contribution approved successfully.', contribution });
  } catch (error) {
    console.error('Approve contribution error:', error);
    res.status(500).json({ message: 'Server error approving contribution.' });
  }
};

const rejectContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (!contribution) {
      return res.status(404).json({ message: 'Contribution not found.' });
    }

    // Ensure belongs to creator
    if (contribution.creatorEmail !== req.user.email) {
      return res.status(403).json({ message: 'Unauthorized. You can only manage contributions for your own campaigns.' });
    }

    if (contribution.status !== 'pending') {
      return res.status(400).json({ message: 'This contribution has already been processed.' });
    }

    // Update status to rejected
    contribution.status = 'rejected';
    await contribution.save();

    // REFUND Supporter credits
    await User.findOneAndUpdate(
      { email: contribution.supporterEmail },
      { $inc: { credits: contribution.contributionAmount } }
    );

    // Notify Supporter
    await createNotification(
      `Your contribution of ${contribution.contributionAmount} credits to ${contribution.campaignTitle} was rejected by ${contribution.creatorName}. Your credits have been refunded.`,
      contribution.supporterEmail,
      '/dashboard/supporter'
    );

    res.status(200).json({ message: 'Contribution rejected and credits refunded.', contribution });
  } catch (error) {
    console.error('Reject contribution error:', error);
    res.status(500).json({ message: 'Server error rejecting contribution.' });
  }
};

module.exports = {
  createContribution,
  getSupporterContributions,
  getCreatorContributions,
  approveContribution,
  rejectContribution
};
