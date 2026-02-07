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
    if (type === 'production' || type === 'transfer' || type === 'return') {
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
  if (type !== 'reserve' && type !== 'fulfill_reservation') { // Maybe we track reservation as movement too? Usually movements track physical change.
      // Let's track physical changes only for InventoryMovement
      await InventoryMovement.create({
        productId,
        locationId: type.includes('out') || type === 'sale' ? inventory.locationId : null,
        toLocation: type.includes('production') || type === 'return' ? inventory.locationId : null,
        quantity,
        type,
        referenceId,
        companyId: user.companyId,
        performedBy: user._id
      });
  }
  
  return inventory;
};

module.exports = {
  getInventory,
  updateStock
};
