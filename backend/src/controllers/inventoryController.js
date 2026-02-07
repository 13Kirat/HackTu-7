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
        const inventory = await Inventory.aggregate([
            { $match: { companyId: req.user.companyId } },
            { $group: {
                _id: '$productId',
                totalStock: { $sum: '$totalStock' },
                reservedStock: { $sum: '$reservedStock' },
                availableStock: { $sum: '$availableStock' }
            }},
            { $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'product'
            }},
            { $unwind: '$product' }
        ]);
        res.json(inventory);
    } catch (error) {
        next(error);
    }
};

const updateStock = async (req, res, next) => {
  try {
    const { productId, locationId, quantity, type } = req.body;
    // Basic validation
    if (!productId || !locationId || !quantity || !type) throw new AppError('Missing fields', 400);

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
            .populate('fromLocation', 'name')
            .populate('toLocation', 'name')
            .sort({ createdAt: -1 });
        res.json(movements);
    } catch (error) {
        next(error);
    }
};

module.exports = { getInventory, getCompanyInventory, updateStock, transferStock, getMovementHistory };