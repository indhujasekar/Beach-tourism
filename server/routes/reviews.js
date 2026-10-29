const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { create } = require('../controllers/reviewController');

router.post('/', protect, [
  body('beachId').notEmpty(),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1 to 5'),
  body('comment').trim().notEmpty().withMessage('Write a short comment'),
], validate, create);

module.exports = router;
