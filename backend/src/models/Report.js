const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  campaignTitle: {
    type: String,
    required: true
  },
  reporterEmail: {
    type: String,
    required: true,
    trim: true
  },
  reporterName: {
    type: String,
    required: true,
    trim: true
  },
  reason: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', ReportSchema);
