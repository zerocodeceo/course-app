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
  email: {
    type: String,
    required: true,
    unique: true
  },
  profilePicture: {
    type: String
  },
  plan: {
    type: String,
    enum: ['basic', 'premium'],
    default: 'basic'
  },
  location: {
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  purchaseDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema) 