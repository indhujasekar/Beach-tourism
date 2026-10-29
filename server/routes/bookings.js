const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const c = require('../controllers/bookingController');

router.use(protect);
router.get('/mine', c.mine);
router.post('/', [
  body('activityId').notEmpty().withMessage('Choose an activity'),
  body('date').isISO8601().withMessage('Choose a valid date'),
], validate, c.create);
router.put('/:id/cancel', c.cancel);

module.exports = router;
