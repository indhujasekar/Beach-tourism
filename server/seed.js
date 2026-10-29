// Usage: npm run seed   (clears and reloads sample data)
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Beach = require('./models/Beach');
const Activity = require('./models/Activity');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

// Sample coordinates are [longitude, latitude]. Replace with beaches from your own region.
const data = [
  { name: 'Palm Cove', lng: 80.262, lat: 12.985, safetyStatus: 'green', crowdLevel: 1, amenities: ['Lifeguard', 'Showers', 'Parking'],
    description: 'A calm, shallow bay ringed with coconut palms. Best for families and first-time swimmers.',
    acts: [['Guided swim', 'swimming', 400, 8], ['Kayak rental', 'kayaking', 600, 5]] },
  { name: 'Silver Sands', lng: 80.268, lat: 12.945, safetyStatus: 'yellow', crowdLevel: 3, amenities: ['Food stalls', 'Restrooms'],
    description: 'A long, busy stretch with food stalls and steady waves. Lively from late afternoon.',
    acts: [['Surf lesson', 'surfing', 1200, 6], ['Swim coaching', 'swimming', 300, 10]] },
  { name: 'Coral Bay', lng: 80.255, lat: 12.905, safetyStatus: 'green', crowdLevel: 1, amenities: ['Lifeguard', 'Gear rental'],
    description: 'Clear water over a small reef close to shore. The best snorkelling on this coast.',
    acts: [['Snorkel tour', 'snorkeling', 900, 4], ['Guided swim', 'swimming', 400, 8]] },
  { name: 'Sunrise Point', lng: 80.245, lat: 12.865, safetyStatus: 'yellow', crowdLevel: 2, amenities: ['Cafe', 'Parking'],
    description: 'Faces east, so sunrises are spectacular. Consistent surf makes it a favourite for learners.',
    acts: [['Surf lesson', 'surfing', 1200, 6], ['Sunrise kayak', 'kayaking', 700, 6]] },
  { name: "Fisherman's Reach", lng: 80.238, lat: 12.825, safetyStatus: 'red', crowdLevel: 1, amenities: ['Boat viewing'],
    description: 'A working fishing beach with strong currents. Great for walks, not for swimming today.',
    acts: [] },
  { name: 'Lagoon Shore', lng: 80.232, lat: 12.79, safetyStatus: 'green', crowdLevel: 2, amenities: ['Lifeguard', 'Restrooms', 'Cafe'],
    description: 'A sheltered lagoon with warm, still water and calm paddling all day.',
    acts: [['Kayak rental', 'kayaking', 600, 5], ['Snorkel tour', 'snorkeling', 900, 4]] },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User, Beach, Activity, Booking, Review].map((m) => m.deleteMany({})));

  const admin = await User.create({ name: 'Admin', email: 'admin@beach.test', password: 'Admin@123', role: 'admin' });
  await User.create({ name: 'Demo Tourist', email: 'tourist@beach.test', password: 'Tourist@123' });

  for (const b of data) {
    const beach = await Beach.create({
      name: b.name, description: b.description, amenities: b.amenities, safetyStatus: b.safetyStatus,
      crowdLevel: b.crowdLevel, location: { type: 'Point', coordinates: [b.lng, b.lat] }, createdBy: admin._id,
    });
    await Activity.insertMany(b.acts.map(([name, type, price, capacity]) => (
      { beach: beach._id, name, type, price, capacity, slotsLeft: capacity })));
  }
  console.log('Seeded. Admin: admin@beach.test / Admin@123 | Tourist: tourist@beach.test / Tourist@123');
  await mongoose.disconnect();
})();
