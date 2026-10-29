const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  beach: { type: mongoose.Schema.Types.ObjectId, ref: 'Beach', required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['swimming', 'surfing', 'snorkeling', 'kayaking'], required: true, index: true },
  price: { type: Number, default: 0, min: 0 },
  capacity: { type: Number, required: true, min: 1 },
  slotsLeft: { type: Number, required: true, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
