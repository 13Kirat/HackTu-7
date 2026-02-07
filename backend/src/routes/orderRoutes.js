const express = require('express');
const router = express.Router();
const { createDealerOrder, createCustomerOrder, getOrders, getOrder, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validate');
const { orderSchemas } = require('../utils/validation');

router.use(protect);

router.post('/dealer', checkRole(['create_order', 'Dealer']), validate(orderSchemas.createOrder), createDealerOrder);
router.post('/customer', checkRole(['create_order', 'Buyer']), validate(orderSchemas.createOrder), createCustomerOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', checkRole(['process_order', 'admin', 'Factory Manager', 'Dealer']), updateOrderStatus);
router.delete('/:id', cancelOrder);

module.exports = router;