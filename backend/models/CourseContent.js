const mongoose = require('mongoose')

const courseContentSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  videoUrl: String,
  order: Number,
  duration: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.CourseContent || mongoose.model('CourseContent', courseContentSchema) 