const Campaign = require('../models/Campaign');
const Contribution = require('../models/Contribution');
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

const createCampaign = async (req, res) => {
  try {
    const { title, story, category, fundingGoal, minimumContribution, deadline, rewardInfo, imageUrl } = req.body;

    if (!title || !story || !category || !fundingGoal || !minimumContribution || !deadline || !rewardInfo || !imageUrl) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Fetch user to get their name
    const creator = await User.findById(req.user.id);
    if (!creator) {
      return res.status(404).json({ message: 'Creator profile not found.' });
    }

    const newCampaign = new Campaign({
      creatorEmail: creator.email,
      creatorName: creator.name,
      title,
      story,
      category,
      fundingGoal: Number(fundingGoal),
      minimumContribution: Number(minimumContribution),
      deadline: new Date(deadline),
      rewardInfo,
      imageUrl,
      status: 'pending' // default status
    });

    await newCampaign.save();

    // Notify Admins
    const admins = await User.find({ role: 'Admin' });
    for (const admin of admins) {
      await createNotification(
        `New campaign '${title}' submitted by ${creator.name} is pending approval.`,
        admin.email,
        '/dashboard/admin'
      );
    }

    res.status(201).json({ message: 'Campaign created successfully, pending Admin approval.', campaign: newCampaign });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ message: 'Server error creating campaign.' });
  }
};

const getCampaigns = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = {};

    // Filter by approval status
    if (status) {
      query.status = status;
    } else {
      // By default, non-admins should only see approved campaigns
      query.status = 'approved';
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });
    res.status(200).json({ campaigns });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ message: 'Server error fetching campaigns.' });
  }
};

const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }
    res.status(200).json({ campaign });
  } catch (error) {
    console.error('Get campaign by ID error:', error);
    res.status(500).json({ message: 'Server error fetching campaign details.' });
  }
};

const updateCampaign = async (req, res) => {
  try {
    const { title, story, rewardInfo, imageUrl, category, fundingGoal, minimumContribution, deadline } = req.body;
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    // Ensure it belongs to the user
    if (campaign.creatorEmail !== req.user.email) {
      return res.status(403).json({ message: 'Unauthorized. You can only update your own campaigns.' });
    }

    // Update fields
    if (title) campaign.title = title;
    if (story) campaign.story = story;
    if (rewardInfo) campaign.rewardInfo = rewardInfo;
    if (imageUrl) campaign.imageUrl = imageUrl;
    if (category) campaign.category = category;
    if (fundingGoal) campaign.fundingGoal = Number(fundingGoal);
    if (minimumContribution) campaign.minimumContribution = Number(minimumContribution);
    if (deadline) campaign.deadline = new Date(deadline);

    await campaign.save();
    res.status(200).json({ message: 'Campaign updated successfully.', campaign });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ message: 'Server error updating campaign.' });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    // Authorize: Admin or Campaign Creator
    const isAdmin = req.user.role === 'Admin';
    const isCreator = campaign.creatorEmail === req.user.email;

    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Unauthorized. Only the creator or an admin can delete campaigns.' });
    }

    // REFUND LOGIC: Find all APPROVED contributions for this campaign
    const contributions = await Contribution.find({
      campaignId: campaign._id,
      status: 'approved'
    });

    // Refund credits to supporters
    for (const contribution of contributions) {
      await User.findOneAndUpdate(
        { email: contribution.supporterEmail },
        { $inc: { credits: contribution.contributionAmount } }
      );

      // Notify the supporter of refund
      await createNotification(
        `The campaign '${campaign.title}' was deleted. Your contribution of ${contribution.contributionAmount} credits has been refunded.`,
        contribution.supporterEmail,
        '/dashboard/supporter'
      );
    }

    // Also notify pending supporters that their contribution will be marked rejected/removed
    const pendingContributions = await Contribution.find({
      campaignId: campaign._id,
      status: 'pending'
    });
    for (const pending of pendingContributions) {
      await createNotification(
        `The campaign '${campaign.title}' was deleted. Your pending contribution of ${pending.contributionAmount} credits was cancelled.`,
        pending.supporterEmail,
        '/dashboard/supporter'
      );
    }

    // Remove contributions records
    await Contribution.deleteMany({ campaignId: campaign._id });

    // Remove campaign
    await Campaign.findByIdAndDelete(campaign._id);

    // Notify Creator
    if (isAdmin && !isCreator) {
      await createNotification(
        `Your campaign '${campaign.title}' has been deleted by an administrator.`,
        campaign.creatorEmail,
        '/dashboard/creator'
      );
    } else {
      await createNotification(
        `Your campaign '${campaign.title}' was successfully deleted and all approved contributors were refunded.`,
        campaign.creatorEmail,
        '/dashboard/creator'
      );
    }

    res.status(200).json({ message: 'Campaign deleted successfully and all contributors refunded.' });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ message: 'Server error deleting campaign.' });
  }
};

const approveCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    campaign.status = 'approved';
    await campaign.save();

    // Notify Creator
    await createNotification(
      `Your campaign '${campaign.title}' has been approved by the Admin and is now live.`,
      campaign.creatorEmail,
      '/dashboard/creator'
    );

    res.status(200).json({ message: 'Campaign approved successfully.', campaign });
  } catch (error) {
    console.error('Approve campaign error:', error);
    res.status(500).json({ message: 'Server error approving campaign.' });
  }
};

const rejectCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    campaign.status = 'rejected';
    await campaign.save();

    // Notify Creator
    await createNotification(
      `Your campaign '${campaign.title}' was rejected by the Admin.`,
      campaign.creatorEmail,
      '/dashboard/creator'
    );

    res.status(200).json({ message: 'Campaign rejected successfully.', campaign });
  } catch (error) {
    console.error('Reject campaign error:', error);
    res.status(500).json({ message: 'Server error rejecting campaign.' });
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  approveCampaign,
  rejectCampaign
};
