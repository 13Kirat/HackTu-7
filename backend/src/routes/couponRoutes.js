const express = require('express');
const router = express.Router();
const { createCoupon, getCoupons, applyCoupon, deleteCoupon } = require('../controllers/couponController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

router.use(protect);

router.post('/', checkRole(['manage_coupons', 'admin']), createCoupon);
router.get('/', getCoupons);
router.post('/apply', applyCoupon);
router.delete('/:id', checkRole(['manage_coupons', 'admin']), deleteCoupon);

module.exports = router;
