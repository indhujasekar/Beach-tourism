const Booking = require('../models/Booking');
const Activity = require('../models/Activity');

exports.create = async (req, res) => {
  const { activityId, date } = req.body;
  const guests = Number(req.body.guests || 1);
  if (!(guests >= 1)) { res.status(400); throw new Error('Guests must be at least 1'); }

  // Atomic check-and-decrement: two people cannot take the same last spot.
  const activity = await Activity.findOneAndUpdate(
    { _id: activityId, slotsLeft: { $gte: guests } },
    { $inc: { slotsLeft: -guests } },
    { new: true }
  );
  if (!activity) { res.status(409); throw new Error('Not enough spots left for this activity'); }

  try {
    const booking = await Booking.create({
      user: req.user._id, activity: activity._id, beach: activity.beach,
      date, guests, totalPrice: activity.price * guests,
    });
    res.status(201).json(booking);
  } catch (err) {
    await Activity.updateOne({ _id: activity._id }, { $inc: { slotsLeft: guests } }); // roll back
    throw err;
  }
};

exports.mine = async (req, res) => {
  res.json(await Booking.find({ user: req.user._id })
    .populate('activity', 'name type').populate('beach', 'name').sort('-createdAt'));
};

exports.cancel = async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id, status: 'confirmed' });
  if (!booking) { res.status(404); throw new Error('Booking not found or already cancelled'); }
  booking.status = 'cancelled';
  await booking.save();
  await Activity.updateOne({ _id: booking.activity }, { $inc: { slotsLeft: booking.guests } });
  res.json(booking);
};
