const Inventory = require('../models/Inventory');
const InventoryMovement = require('../models/InventoryMovement');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

const getInventory = async (companyId, locationId) => {
  const query = { companyId };
  if (locationId) query.locationId = locationId;
  return await Inventory.find(query).populate('productId', 'name sku price');
};

const updateStock = async (user, productId, locationId, quantity, type, referenceId) => {
  // quantity: positive to add, negative to remove (except for specific types we can enforce logic)
  // Let's keep quantity absolute and use 'type' to determine sign.
  
  let inventory = await Inventory.findOne({ productId, locationId });
  
  if (!inventory) {
    if (type === 'production' || type === 'transfer_in' || type === 'return') {
      // Create if not exists only for adding stock
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

  let change = 0;
  
  switch (type) {
    case 'production':
    case 'return':
    case 'adjustment_add':
    case 'transfer_in':
      change = quantity;
      inventory.totalStock += quantity;
      break;
    case 'sale':
    case 'transfer_out':
    case 'adjustment_sub':
      if (inventory.availableStock < quantity) {
        throw new AppError('Insufficient available stock', 400);
      }
      change = -quantity;
      inventory.totalStock -= quantity;
      break;
    case 'reserve':
        if (inventory.availableStock < quantity) {
            throw new AppError('Insufficient stock to reserve', 400);
        }
        inventory.reservedStock += quantity;
        change = 0; // Total stock doesn't change, just availability
        break;
    case 'fulfill_reservation':
        // Reduces total and reserved
        inventory.reservedStock -= quantity;
        inventory.totalStock -= quantity;
        change = -quantity;
        break;
    default:
      throw new AppError('Invalid movement type', 400);
  }

  // Recalculate available is done in pre-save hook of model, but good to be explicit or rely on hook
  // inventory.availableStock = inventory.totalStock - inventory.reservedStock;
  
  await inventory.save();

  // Log movement
  if (type !== 'reserve') { 
      await InventoryMovement.create({
        productId,
        fromLocation: (type.includes('out') || type === 'sale' || type === 'fulfill_reservation') ? inventory.locationId : null,
        toLocation: (type.includes('in') || type === 'production' || type === 'return' || type === 'adjustment_add') ? inventory.locationId : null,
        quantity,
        type,
        referenceId,
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

  // 1. Deduct from Source
  await updateStock(user, productId, fromLocationId, quantity, 'transfer_out');

  // 2. Add to Destination
  await updateStock(user, productId, toLocationId, quantity, 'transfer_in'); // We need to handle 'transfer_in' in updateStock switch or map it
  
  // Note: updateStock logs movement. But here we have one logical transfer.
  // The current updateStock implementation logs movement for each call.
  // Ideally, we link them via referenceId.
  return { message: 'Transfer successful' };
};

module.exports = {
  getInventory,
  updateStock,
  transferStock
};
