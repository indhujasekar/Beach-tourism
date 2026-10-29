const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  beach: { type: mongoose.Schema.Types.ObjectId, ref: 'Beach', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 300 },
}, { timestamps: true });

reviewSchema.index({ user: 1, beach: 1 }, { unique: true }); // one review per user per beach

module.exports = mongoose.model('Review', reviewSchema);
