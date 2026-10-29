const Review = require('../models/Review');
const Beach = require('../models/Beach');

exports.create = async (req, res) => {
  const { beachId, rating, comment } = req.body;
  if (!(await Beach.exists({ _id: beachId }))) { res.status(404); throw new Error('Beach not found'); }
  const review = await Review.create({ user: req.user._id, beach: beachId, rating, comment });

  const [s] = await Review.aggregate([
    { $match: { beach: review.beach } },
    { $group: { _id: null, avg: { $avg: '$rating' }, n: { $sum: 1 } } },
  ]);
  await Beach.updateOne({ _id: beachId }, { avgRating: Math.round(s.avg * 10) / 10, reviewCount: s.n });
  res.status(201).json(await review.populate('user', 'name'));
};
