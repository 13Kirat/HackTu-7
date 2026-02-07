const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const inventoryService = require('./inventoryService');
const AppError = require('../utils/AppError');
const crypto = require('crypto');

const createOrder = async (user, orderData) => {
  const { items, fromLocationId, toLocationId, orderType, customerId } = orderData;
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
    orderType: orderType || 'customer_order',
    customerId: customerId || user._id,
    fromLocationId,
    toLocationId,
    items: processedItems,
    totalAmount,
    status: 'pending'
  });

  return order;
};

const updateOrderStatus = async (user, orderId, status) => {
  const order = await Order.findOne({ _id: orderId, companyId: user.companyId });
  if (!order) throw new AppError('Order not found', 404);

  if (status === 'shipped' && order.status !== 'shipped' && order.status !== 'delivered') {
     // Fulfill reservation (deduct physical stock)
     for (const item of order.items) {
       await inventoryService.updateStock(
         user, 
         item.productId, 
         order.fromLocationId, 
         item.quantity, 
         'fulfill_reserve', 
         order._id,
         false,
         order.toLocationId
       );
     }
  }

  if (status === 'delivered' && order.status !== 'delivered') {
      // If dealer_order, add stock to destination location
      if (order.orderType === 'dealer_order' && order.toLocationId) {
          for (const item of order.items) {
              await inventoryService.updateStock(
                  user,
                  item.productId,
                  order.toLocationId,
                  item.quantity,
                  'transfer', // Add to destination
                  order._id,
                  true // Skip logging movement here as it was logged during shipment/transfer logically
              );
          }
      }
  }

  if (status === 'cancelled' && order.status !== 'cancelled') {
      // Release reserved stock if it was still pending or confirmed (not yet shipped)
      if (['pending', 'confirmed'].includes(order.status)) {
          for (const item of order.items) {
              await inventoryService.updateStock(
                  user,
                  item.productId,
                  order.fromLocationId,
                  item.quantity,
                  'release_reserve'
              );
          }
      } else if (['shipped', 'delivered'].includes(order.status)) {
          // If already shipped, cancellation might mean a return? 
          // For now, let's just handle it as not possible or need manual return.
          throw new AppError('Cannot cancel order after it has been shipped', 400);
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
