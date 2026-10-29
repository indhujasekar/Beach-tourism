const Beach = require('../models/Beach');
const Activity = require('../models/Activity');
const Review = require('../models/Review');

const pick = (b) => {
  const d = {
    name: b.name, description: b.description, amenities: b.amenities, photos: b.photos,
    safetyStatus: b.safetyStatus, crowdLevel: b.crowdLevel,
  };
  if (b.lat != null && b.lng != null) d.location = { type: 'Point', coordinates: [+b.lng, +b.lat] };
  Object.keys(d).forEach((k) => d[k] === undefined && delete d[k]);
  return d;
};

const ownBeach = async (req, res) => {
  const beach = await Beach.findById(req.params.id);
  if (!beach) { res.status(404); throw new Error('Beach not found'); }
  if (req.user.role !== 'admin' && String(beach.createdBy) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You can only manage beaches you created');
  }
  return beach;
};

// GET /api/beaches?q=&activity=surfing,swimming&lat=&lng=&radius=25&sort=rating|crowd|name
exports.list = async (req, res) => {
  const { q, activity, lat, lng, radius = 25, sort } = req.query;
  const filter = {};
  if (q) filter.name = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (activity) {
    filter._id = { $in: await Activity.distinct('beach', { type: { $in: activity.split(',') } }) };
  }
  const near = lat && lng;
  if (near) {
    filter.location = { $near: { $geometry: { type: 'Point', coordinates: [+lng, +lat] }, $maxDistance: +radius * 1000 } };
  }
  const order = { rating: { avgRating: -1 }, crowd: { crowdLevel: 1 }, name: { name: 1 } }[sort] || { avgRating: -1 };
  const query = Beach.find(filter);
  if (!near) query.sort(order); // $near already sorts by distance
  res.json(await query);
};

exports.get = async (req, res) => {
  const beach = await Beach.findById(req.params.id);
  if (!beach) { res.status(404); throw new Error('Beach not found'); }
  const [activities, reviews] = await Promise.all([
    Activity.find({ beach: beach._id }),
    Review.find({ beach: beach._id }).populate('user', 'name').sort('-createdAt'),
  ]);
  res.json({ beach, activities, reviews });
};

exports.create = async (req, res) => {
  res.status(201).json(await Beach.create({ ...pick(req.body), createdBy: req.user._id }));
};

exports.update = async (req, res) => {
  const beach = await ownBeach(req, res);
  Object.assign(beach, pick(req.body));
  res.json(await beach.save());
};

exports.remove = async (req, res) => {
  const beach = await ownBeach(req, res);
  await Promise.all([
    Activity.deleteMany({ beach: beach._id }),
    Review.deleteMany({ beach: beach._id }),
    beach.deleteOne(),
  ]);
  res.json({ message: 'Beach deleted' });
};

exports.addActivity = async (req, res) => {
  const beach = await ownBeach(req, res);
  const { name, type, price, capacity } = req.body;
  res.status(201).json(await Activity.create({ beach: beach._id, name, type, price, capacity, slotsLeft: capacity }));
};

// Weather is cached for 10 minutes to stay inside API rate limits.
const cache = new Map();
exports.weather = async (req, res) => {
  const beach = await Beach.findById(req.params.id);
  if (!beach) { res.status(404); throw new Error('Beach not found'); }
  const hit = cache.get(String(beach._id));
  if (hit && Date.now() - hit.at < 10 * 60 * 1000) return res.json(hit.data);

  const [lng, lat] = beach.location.coordinates;
  let data = { temp: 31, wind: 12, humidity: 70, description: 'partly cloudy', source: 'sample' };
  if (process.env.OPENWEATHER_API_KEY) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    const r = await fetch(url);
    if (!r.ok) { res.status(502); throw new Error('Weather service is unavailable right now'); }
    const j = await r.json();
    data = {
      temp: Math.round(j.main.temp), wind: Math.round(j.wind.speed * 3.6), humidity: j.main.humidity,
      description: j.weather[0].description, source: 'openweathermap',
    };
  }
  // Estimated tide curve (sine model). Replace with a tide API such as WorldTides for real data.
  const phase = parseInt(String(beach._id).slice(-2), 16) % 12;
  data.tide = Array.from({ length: 25 }, (_, h) => +(1 + 0.9 * Math.sin((2 * Math.PI * (h + phase)) / 12.4)).toFixed(2));
  cache.set(String(beach._id), { at: Date.now(), data });
  res.json(data);
};
