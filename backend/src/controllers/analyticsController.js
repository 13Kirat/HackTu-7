const Order = require('../models/Order');
const Inventory = require('../models/Inventory');

const getSalesSummary = async (req, res, next) => {
    try {
        // Sales by Product
        const sales = await Order.aggregate([
            { $match: { companyId: req.user.companyId, status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            { $group: {
                _id: '$items.productId',
                totalQuantity: { $sum: '$items.quantity' },
                totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.priceAtTime'] } }
            }},
            { $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'product'
            }},
            { $unwind: '$product' }
        ]);
        res.json(sales);
    } catch (error) {
        next(error);
    }
};

const getStockInsights = async (req, res, next) => {
    try {
        // Classify stock based on movement (Dummy logic as we need historical movement data for accurate classification)
        // Fast-moving: High sales/movements
        // Dead stock: No movement
        
        // Return simple inventory dump sorted by quantity for now as a proxy
        const stock = await Inventory.find({ companyId: req.user.companyId }).populate('productId');
        res.json(stock);
    } catch (error) {
        next(error);
    }
};

const getImbalances = async (req, res, next) => {
    try {
        // Shortage: available < 10
        // Overstock: available > 1000 (Dummy thresholds)
        
        const shortages = await Inventory.find({ 
            companyId: req.user.companyId, 
            availableStock: { $lt: 10 } 
        }).populate('productId').populate('locationId');
        
        const overstock = await Inventory.find({ 
            companyId: req.user.companyId, 
            availableStock: { $gt: 1000 } 
        }).populate('productId').populate('locationId');

        res.json({ shortages, overstock });
    } catch (error) {
        next(error);
    }
};

module.exports = { getSalesSummary, getStockInsights, getImbalances };
