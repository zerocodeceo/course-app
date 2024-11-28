const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  email: String,
  profilePicture: String,
  plan: {
    type: String,
    enum: ['basic', 'premium'],
    default: 'basic'
  },
  purchaseDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema) 