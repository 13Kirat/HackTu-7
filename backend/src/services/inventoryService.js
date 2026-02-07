const Inventory = require('../models/Inventory');
const InventoryMovement = require('../models/InventoryMovement');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const alertService = require('./alertService');

const getInventory = async (companyId, locationId) => {
  const query = { companyId };
  if (locationId) query.locationId = locationId;
  return await Inventory.find(query).populate('productId', 'name sku price');
};

const getCompanyInventory = async (companyId) => {
  return await Inventory.aggregate([
    { $match: { companyId } },
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
};

const updateStock = async (user, productId, locationId, quantity, type, orderId = null, skipLogging = false, toLocationId = null) => {
  let inventory = await Inventory.findOne({ productId, locationId });
  
  if (!inventory) {
    if (['manufacture', 'transfer', 'return', 'adjustment'].includes(type)) {
      inventory = new Inventory({
        productId,
        locationId,
        companyId: user.companyId,
        totalStock: 0,
        availableStock: 0,
        reservedStock: 0
      });
    } else {
      throw new AppError('Inventory record not found', 404);
    }
  }

  switch (type) {
    case 'manufacture':
    case 'return':
      inventory.totalStock += quantity;
      break;
    case 'sale':
      if (inventory.availableStock < quantity) {
        throw new AppError('Insufficient available stock', 400);
      }
      inventory.totalStock -= quantity;
      break;
    case 'transfer':
      if (quantity < 0 && inventory.availableStock < Math.abs(quantity)) {
          throw new AppError('Insufficient stock for transfer', 400);
      }
      inventory.totalStock += quantity;
      break;
    case 'adjustment':
      inventory.totalStock += quantity;
      break;
    case 'reserve':
      if (inventory.availableStock < quantity) {
        throw new AppError('Insufficient stock to reserve', 400);
      }
      inventory.reservedStock += quantity;
      break;
    case 'release_reserve':
      inventory.reservedStock -= Math.min(quantity, inventory.reservedStock);
      break;
    case 'fulfill_reserve':
      inventory.reservedStock -= Math.min(quantity, inventory.reservedStock);
      inventory.totalStock -= quantity;
      break;
    default:
      throw new AppError('Invalid movement type', 400);
  }

  await inventory.save();

  // Check for alerts
  alertService.checkAndTriggerAlerts(user.companyId, locationId, productId).catch(err => console.error('Alert trigger error:', err));

  // Log movement for physical changes
  if (!skipLogging && !['reserve', 'release_reserve'].includes(type)) {
    await InventoryMovement.create({
      productId,
      fromLocationId: (type === 'sale' || type === 'fulfill_reserve') ? locationId : null,
      toLocationId: (type === 'manufacture' || type === 'return') ? locationId : toLocationId,
      quantity: Math.abs(quantity),
      movementType: type === 'fulfill_reserve' ? 'sale' : type,
      orderId,
      companyId: user.companyId,
      performedBy: user._id
    });
  }
  
  return inventory;
};

const transferStock = async (user, productId, fromLocationId, toLocationId, quantity) => {
  if (fromLocationId === toLocationId) {
    throw new AppError('Cannot transfer to same location', 400);
  }

  // 1. Deduct from Source (Skip logging individual leg)
  await updateStock(user, productId, fromLocationId, -quantity, 'transfer', null, true);

  // 2. Add to Destination (Skip logging individual leg)
  await updateStock(user, productId, toLocationId, quantity, 'transfer', null, true); 
  
  // 3. Log single combined movement record
  await InventoryMovement.create({
    productId,
    fromLocationId,
    toLocationId,
    quantity,
    movementType: 'transfer',
    companyId: user.companyId,
    performedBy: user._id
  });

  return { message: 'Transfer successful' };
};

module.exports = {
  getInventory,
  getCompanyInventory,
  updateStock,
  transferStock
};
