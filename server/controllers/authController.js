const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const out = (u) => ({ token: sign(u), user: { id: u._id, name: u.name, email: u.email, role: u.role } });

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (await User.findOne({ email })) { res.status(409); throw new Error('Email is already registered'); }
  // Only tourist/operator can self-register. Admins are created via the seed script.
  const user = await User.create({ name, email, password, role: role === 'operator' ? 'operator' : 'tourist' });
  res.status(201).json(out(user));
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.matchPassword(req.body.password))) {
    res.status(401);
    throw new Error('Incorrect email or password');
  }
  res.json(out(user));
};

exports.me = (req, res) => res.json({ id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role });
