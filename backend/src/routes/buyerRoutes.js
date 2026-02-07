const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    getProducts,
    getProduct,
    checkAvailability,
    getCoupons,
    validateCoupon,
    placeOrder,
    getOrders,
    getOrder,
    cancelOrder,
    getTracking,
    getSummary,
    getAlerts
} = require('../controllers/buyerController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validate');
const { buyerSchemas } = require('../utils/validation');

router.use(protect);
router.use(checkRole(['buyer', 'retailer', 'contractor', 'Buyer', 'Retailer', 'Contractor'])); // Handle casing just in case

// 1. BUYER PROFILE
router.get('/profile', getProfile);
router.put('/profile', validate(buyerSchemas.updateProfile), updateProfile);

// 2. PRODUCT CATALOG
router.get('/products', getProducts);
router.get('/products/:productId', getProduct);

// 3. AVAILABILITY CHECK
router.get('/availability/:productId', checkAvailability);

// 4. COUPON APIs
router.get('/coupons', getCoupons);
router.post('/coupons/validate', validate(buyerSchemas.validateCoupon), validateCoupon);

// 5. ORDER APIs
router.post('/orders', validate(buyerSchemas.placeOrder), placeOrder);
router.get('/orders', getOrders);
router.get('/orders/summary', getSummary);
router.get('/orders/:orderId', getOrder);
router.delete('/orders/:orderId', cancelOrder);

// 6. ORDER TRACKING
router.get('/orders/:orderId/tracking', getTracking);

// 8. ALERTS
router.get('/alerts', getAlerts);

module.exports = router;
