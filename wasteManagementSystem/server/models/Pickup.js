    // server/models/Pickup.js

const mongoose = require('mongoose');

const PickupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  wasteQuantity: {
    type: Number, // e.g., in kilograms
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Pickup', PickupSchema);