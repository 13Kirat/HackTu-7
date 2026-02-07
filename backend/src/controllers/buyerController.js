const buyerService = require('../services/buyerService');
const orderService = require('../services/orderService');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Alert = require('../models/Alert');
const AppError = require('../utils/AppError');

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('role').select('-password');
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true }).select('-password');
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {
    try {
        const products = await buyerService.getProductCatalog(req.user, req.query);
        res.json(products);
    } catch (error) {
        next(error);
    }
};

const getProduct = async (req, res, next) => {
    try {
        const product = await buyerService.getProductDetails(req.user, req.params.productId);
        res.json(product);
    } catch (error) {
        next(error);
    }
};

const checkAvailability = async (req, res, next) => {
    try {
        const product = await buyerService.getProductDetails(req.user, req.params.productId);
        res.json({
            productId: product.product._id,
            availableStock: product.availableStock,
            price: product.product.price,
            dealer: product.dealerLocation
        });
    } catch (error) {
        next(error);
    }
};

const getCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find({
            companyId: req.user.companyId,
            isActive: true,
            validUntil: { $gt: new Date() }
        });
        res.json(coupons);
    } catch (error) {
        next(error);
    }
};

const validateCoupon = async (req, res, next) => {
    try {
        const { couponCode, items } = req.body;
        const coupon = await Coupon.findOne({ code: couponCode, companyId: req.user.companyId, isActive: true });
        
        if (!coupon || (coupon.validUntil && new Date() > coupon.validUntil)) {
            throw new AppError('Invalid or expired coupon', 400);
        }

        // Calculate order value
        let orderValue = 0;
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (product) orderValue += product.price * item.quantity;
        }

        if (orderValue < coupon.minOrderValue) {
            throw new AppError(`Minimum order value of ${coupon.minOrderValue} required`, 400);
        }

        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (orderValue * coupon.discountValue) / 100;
        } else {
            discountAmount = coupon.discountValue;
        }

        res.json({ valid: true, discountAmount });
    } catch (error) {
        next(error);
    }
};

const placeOrder = async (req, res, next) => {
    try {
        const dealer = await buyerService.getNearestDealer(req.user);
        const orderData = {
            ...req.body,
            fromLocationId: dealer._id,
            orderType: 'customer_order',
            customerId: req.user._id
        };
        const order = await orderService.createOrder(req.user, orderData);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

const getOrders = async (req, res, next) => {
    try {
        const query = { customerId: req.user._id, companyId: req.user.companyId };
        if (req.query.status) query.status = req.query.status;
        
        const orders = await Order.find(query).sort({ createdAt: -1 }).populate('items.productId');
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.orderId, customerId: req.user._id })
            .populate('items.productId')
            .populate('fromLocationId');
        if (!order) throw new AppError('Order not found', 404);
        res.json(order);
    } catch (error) {
        next(error);
    }
};

const cancelOrder = async (req, res, next) => {
    try {
        const order = await orderService.updateOrderStatus(req.user, req.params.orderId, 'cancelled');
        res.json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        next(error);
    }
};

const getTracking = async (req, res, next) => {
    try {
        const tracking = await buyerService.getOrderTracking(req.user, req.params.orderId);
        res.json(tracking);
    } catch (error) {
        next(error);
    }
};

const getSummary = async (req, res, next) => {
    try {
        const summary = await buyerService.getOrderSummary(req.user);
        res.json(summary);
    } catch (error) {
        next(error);
    }
};

const getAlerts = async (req, res, next) => {
    try {
        const alerts = await Alert.find({
            companyId: req.user.companyId,
            // Logic for buyer-specific alerts?
            // Usually alerts for their orders.
            message: { $regex: req.user.name, $options: 'i' } // Simplified for now
        }).sort({ createdAt: -1 });
        res.json(alerts);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getProducts,
    getProduct,
    checkAvailability,
    getCoupons,
    validateCoupon,
    placeOrder,
    getOrders,
    getOrder,
    cancelOrder,
    getTracking,
    getSummary,
    getAlerts
};
