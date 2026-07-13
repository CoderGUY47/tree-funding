const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  campaignTitle: {
    type: String,
    required: true
  },
  contributionAmount: {
    type: Number,
    required: true
  },
  supporterEmail: {
    type: String,
    required: true,
    trim: true
  },
  supporterName: {
    type: String,
    required: true,
    trim: true
  },
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
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contribution', ContributionSchema);
