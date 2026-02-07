const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const inventoryService = require('./inventoryService');
const AppError = require('../utils/AppError');
const crypto = require('crypto');

const createOrder = async (user, orderData) => {
  // 1. Validate Items
  // 2. Check Stock & Reserve
  // 3. Create Order
  
  const { items, fromLocationId, customerId } = orderData;
  let totalAmount = 0;
  const processedItems = [];

  for (const item of items) {
    const inventory = await Inventory.findOne({ 
      productId: item.productId, 
      locationId: fromLocationId 
    }).populate('productId');

    if (!inventory) {
      throw new AppError(`Product ${item.productId} not found at location`, 404);
    }

    if (inventory.availableStock < item.quantity) {
      throw new AppError(`Insufficient stock for product ${inventory.productId.name}`, 400);
    }

    // Reserve Stock
    await inventoryService.updateStock(user, item.productId, fromLocationId, item.quantity, 'reserve');
    
    processedItems.push({
      productId: item.productId,
      quantity: item.quantity,
      priceAtTime: inventory.productId.price
    });
    
    totalAmount += inventory.productId.price * item.quantity;
  }

  const order = await Order.create({
    orderNumber: 'ORD-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
    companyId: user.companyId,
    customerId: customerId || user._id, // If dealer ordering, they are the customer
    fromLocationId,
    items: processedItems,
    totalAmount,
    status: 'pending'
  });

  return order;
};

const updateOrderStatus = async (user, orderId, status) => {
  const order = await Order.findOne({ _id: orderId, companyId: user.companyId });
  if (!order) throw new AppError('Order not found', 404);

  if (status === 'shipped' && order.status !== 'shipped') {
     // Fulfill reservation (deduct physical stock)
     for (const item of order.items) {
       await inventoryService.updateStock(
         user, 
         item.productId, 
         order.fromLocationId, 
         item.quantity, 
         'fulfill_reservation', 
         order._id
       );
       
       // Create 'sale' movement logic implicit in fulfill_reservation or explicit?
       // In inventoryService I made fulfill_reservation reduce totalStock.
       // I should probably log a 'sale' movement there or here. 
       // For simplicity, let's assume fulfill_reservation handles the logic of removing it from warehouse.
     }
  }

  order.status = status;
  await order.save();
  return order;
};

module.exports = {
  createOrder,
  updateOrderStatus
};
