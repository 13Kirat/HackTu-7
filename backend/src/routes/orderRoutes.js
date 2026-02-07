const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', createOrder);
router.get('/', getOrders);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
