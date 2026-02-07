const express = require('express');
const router = express.Router();
const { createCoupon, getCoupons, applyCoupon, deleteCoupon } = require('../controllers/couponController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

const validate = require('../middlewares/validate');
const { couponSchemas } = require('../utils/validation');

router.use(protect);

router.post('/', checkRole(['manage_coupons', 'admin']), validate(couponSchemas.createCoupon), createCoupon);
router.get('/', getCoupons);
router.put('/:id', checkRole(['manage_coupons', 'admin']), updateCoupon);
router.post('/apply', applyCoupon);
router.delete('/:id', checkRole(['manage_coupons', 'admin']), deleteCoupon);

module.exports = router;
