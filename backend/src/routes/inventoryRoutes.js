const express = require('express');
const router = express.Router();
const { getInventory, updateStock } = require('../controllers/inventoryController');
const { protect, checkRole } = require('../middlewares/authMiddleware'); // Wait, checkRole is in roleMiddleware
// Fix import
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

router.use(protect);

router.get('/', getInventory);
router.post('/update', checkRole(['create_inventory', 'update_inventory', 'Factory Manager', 'Warehouse Manager']), updateStock);

module.exports = router;
