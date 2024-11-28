const userSchema = new mongoose.Schema({
  // ... existing fields ...
  purchaseDate: {
    type: Date,
    default: Date.now
  }
}) 