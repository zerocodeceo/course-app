const mongoose = require('mongoose')

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoId: {
    type: String,
    required: true
  },
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

// Compound index to ensure unique progress entries per user and video
userProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true })

module.exports = mongoose.model('UserProgress', userProgressSchema) 