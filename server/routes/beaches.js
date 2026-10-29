const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, restrictTo } = require('../middleware/auth');
const c = require('../controllers/beachController');

const staff = [protect, restrictTo('admin', 'operator')];

router.get('/', c.list);
router.get('/:id', c.get);
router.get('/:id/weather', c.weather);
router.post('/', staff, [
  body('name').trim().notEmpty().withMessage('Beach name is required'),
  body('lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('lng').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
], validate, c.create);
router.put('/:id', staff, c.update);
router.delete('/:id', staff, c.remove);
router.post('/:id/activities', staff, [
  body('name').notEmpty(), body('type').isIn(['swimming', 'surfing', 'snorkeling', 'kayaking']),
  body('capacity').isInt({ min: 1 }),
], validate, c.addActivity);

module.exports = router;
