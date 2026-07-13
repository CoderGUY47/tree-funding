const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
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
  withdrawalCredit: {
    type: Number,
    required: true
  },
  withdrawalAmount: {
    type: Number,
    required: true
  },
  paymentSystem: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending'
  },
  withdrawDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
