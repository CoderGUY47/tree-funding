const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false
  },
  photoUrl: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['Supporter', 'Creator', 'Admin'],
    default: 'Supporter'
  },
  credits: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
