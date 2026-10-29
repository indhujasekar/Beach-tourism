const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) { res.status(401); throw new Error('Please log in first'); }
  try {
    const { id } = jwt.verify(h.slice(7), process.env.JWT_SECRET);
    req.user = await User.findById(id);
  } catch {
    res.status(401);
    throw new Error('Session expired. Please log in again');
  }
  if (!req.user) { res.status(401); throw new Error('User no longer exists'); }
  next();
};

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) { res.status(403); throw new Error('You do not have permission to do this'); }
  next();
};
