const express = require('express');
const router = express.Router();
const { createShipment, getShipments, getShipment, updateShipmentStatus } = require('../controllers/shipmentController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

router.use(protect);

router.post('/', checkRole(['create_shipment', 'admin']), createShipment);
router.get('/', getShipments);
router.get('/:id', getShipment);
router.put('/:id/status', checkRole(['update_shipment', 'admin']), updateShipmentStatus);

module.exports = router;
