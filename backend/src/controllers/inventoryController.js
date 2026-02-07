const inventoryService = require('../services/inventoryService');

const getInventory = async (req, res, next) => {
  try {
    const { locationId } = req.query;
    // Users can only see inventory for their company
    const inventory = await inventoryService.getInventory(req.user.companyId, locationId);
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { productId, locationId, quantity, type } = req.body;
    // TODO: Validate location belongs to company
    const updatedInventory = await inventoryService.updateStock(
      req.user,
      productId,
      locationId,
      quantity,
      type
    );
    res.json(updatedInventory);
  } catch (error) {
    next(error);
  }
};

module.exports = { getInventory, updateStock };
