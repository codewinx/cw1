// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
    required: true,
    enum: ['admin', 'manager', 'cutter', 'tailor', 'handworker', 'customer'],
  },
  // Star rating for cutters and tailors (optional)
  starRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
});

module.exports = mongoose.model('User', userSchema);