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

    if (!inventory || !inventory.productId) {
      throw new AppError(`Product data missing for item ${item.productId} at location`, 500);
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
    status: orderData.status || 'pending'
  });

  // If created as delivered (Offline Bill), fulfill immediately
  if (order.status === 'delivered') {
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

  return order;
};

const updateOrderStatus = async (user, orderId, status) => {
  const order = await Order.findOne({ _id: orderId, companyId: user.companyId });
  if (!order) throw new AppError('Order not found', 404);

  // LOGIC: If status becomes Shipped or Delivered, deduct from Source if not already done.
  // If status becomes Delivered, add to Destination if dealer_order and not already done.

  if (['shipped', 'delivered'].includes(status)) {
      if (!['shipped', 'delivered'].includes(order.status)) {
          // Physical stock deduction from source (fulfill reservation)
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
  }

  if (status === 'delivered' && order.status !== 'delivered') {
      // Add stock to destination for internal dealer orders
      if (order.orderType === 'dealer_order' && order.toLocationId) {
          for (const item of order.items) {
              await inventoryService.updateStock(
                  user,
                  item.productId,
                  order.toLocationId,
                  item.quantity,
                  'transfer', // Addition leg of the transfer
                  order._id,
                  true // Movement already logged by fulfill_reserve leg logically
              );
          }
      }
  }

  if (['cancelled', 'failed'].includes(status) && !['cancelled', 'failed'].includes(order.status)) {
      // Release reserved stock if it was still pending or confirmed (not yet shipped/delivered)
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
          // If already shipped or delivered, cancellation/failure might need a manual return process
          // but for status update purposes we'll allow it but not auto-revert stock since it's "out"
          if (status === 'cancelled') {
              throw new AppError('Cannot cancel order after it has been shipped', 400);
          }
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
