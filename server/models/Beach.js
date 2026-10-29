const mongoose = require('mongoose');

const beachSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  // GeoJSON point: coordinates are [longitude, latitude]
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  amenities: [String],
  photos: [String],
  safetyStatus: { type: String, enum: ['green', 'yellow', 'red'], default: 'green' },
  crowdLevel: { type: Number, min: 1, max: 3, default: 2 },
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

beachSchema.index({ location: '2dsphere' });
beachSchema.index({ name: 1 });
beachSchema.index({ avgRating: -1 });

module.exports = mongoose.model('Beach', beachSchema);
