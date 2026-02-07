const express = require('express');
const router = express.Router();
const { createDealerOrder, createCustomerOrder, getOrders, getOrder, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

router.use(protect);

router.post('/dealer', checkRole(['create_order', 'Dealer']), createDealerOrder);
router.post('/customer', checkRole(['create_order', 'Buyer']), createCustomerOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', checkRole(['process_order', 'admin', 'Factory Manager', 'Dealer']), updateOrderStatus);
router.delete('/:id', cancelOrder);

module.exports = router;