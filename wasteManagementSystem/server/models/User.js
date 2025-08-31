// server/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'agent', 'admin'],
    default: 'user',
  },
  rewardPoints: {
    type: Number,
    default: 0,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('User', UserSchema);