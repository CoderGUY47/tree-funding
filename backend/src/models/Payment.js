const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
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
  credits: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true // in Dollars
  },
  paymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    default: 'succeeded'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', PaymentSchema);
