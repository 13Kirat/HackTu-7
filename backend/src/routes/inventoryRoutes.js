const express = require('express');
const router = express.Router();
const { getInventory, getCompanyInventory, updateStock, transferStock, getMovementHistory } = require('../controllers/inventoryController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

router.use(protect);

router.post('/', checkRole(['create_inventory', 'admin']), updateStock); // 7.1 Add Inventory
router.get('/location/:locationId', getInventory); // 7.2
router.get('/company', getCompanyInventory); // 7.3
router.put('/:id', checkRole(['update_inventory', 'admin']), updateStock); // 7.4 (Reusing updateStock logic, id ignored in body but implies specific record, simpler to use body params)
router.post('/transfer', checkRole(['transfer_inventory', 'admin']), transferStock); // 8.1
router.get('/movements', getMovementHistory); // 8.2

module.exports = router;