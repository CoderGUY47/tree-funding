const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  creatorEmail: {
    type: String,
    required: true,
    trim: true
  },
  creatorName: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  story: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  fundingGoal: {
    type: Number,
    required: true
  },
  minimumContribution: {
    type: Number,
    required: true
  },
  amountRaised: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  rewardInfo: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Campaign', CampaignSchema);
