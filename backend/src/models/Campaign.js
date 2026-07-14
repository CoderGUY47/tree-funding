const mongoose = require('mongoose');

/**
 * Campaign Schema
 * Represents a fundraising campaign created by a Creator.
 * Supporters contribute credits to campaigns once they are approved by Admin.
 */
const CampaignSchema = new mongoose.Schema({
  /** Email of the creator who owns this campaign */
  creatorEmail: {
    type: String,
    required: true,
    trim: true
  },
  /** Display name of the creator */
  creatorName: {
    type: String,
    required: true,
    trim: true
  },
  /** Title/headline of the campaign */
  title: {
    type: String,
    required: true,
    trim: true
  },
  /** Detailed campaign story / description */
  story: {
    type: String,
    required: true
  },
  /** Campaign category (e.g. Reforestation, Humanitarian, Solar) */
  category: {
    type: String,
    required: true,
    trim: true
  },
  /** Total credits the creator aims to raise */
  fundingGoal: {
    type: Number,
    required: true,
    min: [1, 'Funding goal must be at least 1 credit']
  },
  /** Minimum credits a supporter must pledge */
  minimumContribution: {
    type: Number,
    required: true,
    min: [1, 'Minimum contribution must be at least 1 credit']
  },
  /** Total credits raised so far from approved contributions */
  amountRaised: {
    type: Number,
    default: 0
  },
  /** Campaign funding deadline date */
  deadline: {
    type: Date,
    required: true
  },
  /** Reward/perk offered to supporters who contribute */
  rewardInfo: {
    type: String,
    required: true
  },
  /** CDN URL of the campaign banner image */
  imageUrl: {
    type: String,
    required: true
  },
  /**
   * Admin moderation status:
   * - pending: awaiting admin review
   * - approved: live on the explore page
   * - rejected: hidden from public
   */
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Campaign', CampaignSchema);
