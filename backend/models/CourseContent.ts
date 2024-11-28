import mongoose from 'mongoose'

const courseContentSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  videoUrl: String,
  order: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const CourseContent = mongoose.models.CourseContent || mongoose.model('CourseContent', courseContentSchema)

export default CourseContent 