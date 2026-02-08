const orderService = require('../services/orderService');
const Order = require('../models/Order');
const AppError = require('../utils/AppError');

const createDealerOrder = async (req, res, next) => {
    try {
        const orderData = { ...req.body, customerId: req.user._id, orderType: 'dealer_order' };
        const order = await orderService.createOrder(req.user, orderData);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

const createCustomerOrder = async (req, res, next) => {
    try {
        const orderData = { 
            ...req.body, 
            customerId: req.user._id, 
            orderType: 'customer_order',
            fromLocationId: req.user.locationId, // Fulfilling from their own store
            status: 'delivered' // Offline sale is immediate
        };
        const order = await orderService.createOrder(req.user, orderData);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

const getOrders = async (req, res, next) => {
  try {
    const query = { companyId: req.user.companyId };
    
    // Role based filtering
    if (req.user.role.name === 'Dealer') {
        // Dealer sees orders where they are customer OR where they are fulfilling (fromLocation is their shop)
        // Simplified: Dealer sees their purchases. 
        query.customerId = req.user._id;
    } else if (req.user.role.name === 'Buyer') {
        query.customerId = req.user._id;
    }
    
    const orders = await Order.find(query)
        .populate('items.productId')
        .populate('customerId', 'name')
        .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, companyId: req.user.companyId })
            .populate('items.productId')
            .populate('customerId', 'name');
        if (!order) throw new AppError('Order not found', 404);
        res.json(order);
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

const cancelOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await orderService.updateOrderStatus(req.user, id, 'cancelled');
        res.json({ message: 'Order cancelled', order });
    } catch (error) {
        next(error);
    }
};

module.exports = { createDealerOrder, createCustomerOrder, getOrders, getOrder, updateOrderStatus, cancelOrder };