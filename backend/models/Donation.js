// models/Donation.js
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  itemType: {
    type: String,
    required: true,
    enum: ['clothing', 'food', 'toys', 'books', 'electronics', 'furniture', 'other']
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  pickupAddress: {
    type: String,
    required: true,
    trim: true
  },
  pickupDateTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'collected', 'delivered'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to speed up NGO-availability queries
donationSchema.index({ status: 1, ngo: 1, createdAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);
