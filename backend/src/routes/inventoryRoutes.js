const express = require('express');
const router = express.Router();
const { getInventory, getCompanyInventory, updateStock, transferStock, getMovementHistory } = require('../controllers/inventoryController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validate');
const { inventorySchemas } = require('../utils/validation');

router.use(protect);

router.post('/', checkRole(['create_inventory', 'admin']), validate(inventorySchemas.updateStock), updateStock); 
router.get('/location/:locationId', getInventory); 
router.get('/company', getCompanyInventory); 
router.put('/:id', checkRole(['update_inventory', 'admin']), validate(inventorySchemas.updateStock), updateStock); 
router.post('/transfer', checkRole(['transfer_inventory', 'admin']), validate(inventorySchemas.transferStock), transferStock); 
router.get('/movements', getMovementHistory);

module.exports = router;