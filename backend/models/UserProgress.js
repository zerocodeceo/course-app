const mongoose = require('mongoose')

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  videoId: String,
  duration: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  watchedDuration: { type: Number, default: 0 },
  lastWatched: { type: Date, default: Date.now }
})

module.exports = mongoose.models.UserProgress || mongoose.model('UserProgress', userProgressSchema) 