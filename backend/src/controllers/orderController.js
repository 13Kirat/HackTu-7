const orderService = require('../services/orderService');
const Order = require('../models/Order');

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user, req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    // Filter by company
    const query = { companyId: req.user.companyId };
    
    // If dealer/buyer, only show their orders? 
    // For now, let's just return all orders for the company (Admin view) 
    // or filter if user is not admin.
    if (req.user.role.name === 'Dealer') {
        query.customerId = req.user._id;
    }
    
    const orders = await Order.find(query).populate('items.productId').populate('customerId', 'name');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.user, id, status);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
