const inventoryService = require('../services/inventoryService');
const Inventory = require('../models/Inventory');
const InventoryMovement = require('../models/InventoryMovement');
const AppError = require('../utils/AppError');

const getInventory = async (req, res, next) => {
  try {
    const { locationId } = req.params;
    const inventory = await inventoryService.getInventory(req.user.companyId, locationId);
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

const getCompanyInventory = async (req, res, next) => {
    try {
        const inventory = await inventoryService.getCompanyInventory(req.user.companyId);
        res.json(inventory);
    } catch (error) {
        next(error);
    }
};

const updateStock = async (req, res, next) => {
  try {
    const { productId, locationId, quantity, type } = req.body;
    const { id } = req.params;

    let targetProductId = productId;
    let targetLocationId = locationId;

    if (id) {
        const inventory = await Inventory.findById(id);
        if (!inventory) throw new AppError('Inventory record not found', 404);
        targetProductId = inventory.productId;
        targetLocationId = inventory.locationId;
    }

    if (!targetProductId || !targetLocationId || quantity === undefined || !type) {
        throw new AppError('Missing required fields (productId, locationId, quantity, type)', 400);
    }

    const updatedInventory = await inventoryService.updateStock(
      req.user,
      targetProductId,
      targetLocationId,
      quantity,
      type
    );
    res.json(updatedInventory);
  } catch (error) {
    next(error);
  }
};

const transferStock = async (req, res, next) => {
    try {
        const { productId, fromLocationId, toLocationId, quantity } = req.body;
        if (!productId || !fromLocationId || !toLocationId || !quantity) throw new AppError('Missing fields', 400);

        await inventoryService.transferStock(req.user, productId, fromLocationId, toLocationId, quantity);
        res.json({ message: 'Stock transferred successfully' });
    } catch (error) {
        next(error);
    }
};

const getMovementHistory = async (req, res, next) => {
    try {
        const movements = await InventoryMovement.find({ companyId: req.user.companyId })
            .populate('productId', 'name sku')
            .populate('fromLocationId', 'name')
            .populate('toLocationId', 'name')
            .sort({ createdAt: -1 });
        res.json(movements);
    } catch (error) {
        next(error);
    }
};

module.exports = { getInventory, getCompanyInventory, updateStock, transferStock, getMovementHistory };