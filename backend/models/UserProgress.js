const mongoose = require('mongoose')

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  videoId: String,
  duration: {
    type: Number,
    default: 0
  },
  watchedDuration: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastWatched: {
    type: Date,
    default: Date.now
  }
})

// Remove the compound index since we want multiple entries per user
userProgressSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('UserProgress', userProgressSchema) 