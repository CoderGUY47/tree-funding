const mongoose = require('mongoose');

/**
 * Contribution Schema
 * Records each credit pledge made by a Supporter to a Campaign.
 * Contributions start as 'pending' and must be approved by the Creator.
 * On approval, the amountRaised on the Campaign is incremented.
 * On rejection, the supporter's credits are refunded automatically.
 */
const ContributionSchema = new mongoose.Schema({
  /** Reference to the Campaign being backed */
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  /** Denormalized campaign title for quick query display */
  campaignTitle: {
    type: String,
    required: true
  },
  /** Number of credits pledged by the supporter */
  contributionAmount: {
    type: Number,
    required: true,
    min: [1, 'Contribution must be at least 1 credit']
  },
  /** Email of the supporter who made the contribution */
  supporterEmail: {
    type: String,
    required: true,
    trim: true
  },
  /** Display name of the supporter */
  supporterName: {
    type: String,
    required: true,
    trim: true
  },
  /** Email of the campaign's creator (for creator dashboard filtering) */
  creatorEmail: {
    type: String,
    required: true,
    trim: true
  },
  /** Display name of the campaign's creator */
  creatorName: {
    type: String,
    required: true,
    trim: true
  },
  /**
   * Moderation status set by the Creator:
   * - pending: awaiting creator review
   * - approved: credits locked in campaign; amountRaised updated
   * - rejected: supporter credits refunded
   */
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  /** Date the contribution was originally submitted */
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contribution', ContributionSchema);
