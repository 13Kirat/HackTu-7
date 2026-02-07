const Shipment = require('../models/Shipment');
const Order = require('../models/Order');
const orderService = require('../services/orderService');
const AppError = require('../utils/AppError');

const createShipment = async (req, res, next) => {
    try {
        const { orderId, trackingNumber, carrier, estimatedDelivery } = req.body;
        
        const order = await Order.findOne({ _id: orderId, companyId: req.user.companyId });
        if (!order) throw new AppError('Order not found', 404);

        const shipment = await Shipment.create({
            orderId,
            companyId: req.user.companyId,
            trackingNumber,
            carrier,
            estimatedDelivery,
            status: 'pending'
        });

        // Update Order Status
        order.status = 'confirmed';
        await order.save();

        res.status(201).json(shipment);
    } catch (error) {
        next(error);
    }
};

const getShipments = async (req, res, next) => {
    try {
        const shipments = await Shipment.find({ companyId: req.user.companyId }).populate('orderId');
        res.json(shipments);
    } catch (error) {
        next(error);
    }
};

const getShipment = async (req, res, next) => {
    try {
        const shipment = await Shipment.findOne({ _id: req.params.id, companyId: req.user.companyId }).populate('orderId');
        if (!shipment) throw new AppError('Shipment not found', 404);
        res.json(shipment);
    } catch (error) {
        next(error);
    }
};

const updateShipmentStatus = async (req, res, next) => {
    try {
        const { status } = req.body; // in_transit, delivered
        const shipment = await Shipment.findOne({ _id: req.params.id, companyId: req.user.companyId });
        if (!shipment) throw new AppError('Shipment not found', 404);

        shipment.status = status;
        if (status === 'delivered') {
            shipment.actualDelivery = Date.now();
            await orderService.updateOrderStatus(req.user, shipment.orderId, 'delivered');
        } else if (status === 'in_transit') {
            await orderService.updateOrderStatus(req.user, shipment.orderId, 'shipped');
        }

        await shipment.save();
        res.json(shipment);
    } catch (error) {
        next(error);
    }
};

module.exports = { createShipment, getShipments, getShipment, updateShipmentStatus };
