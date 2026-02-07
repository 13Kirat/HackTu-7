const Location = require('../models/Location');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Order = require('../models/Order');
const Shipment = require('../models/Shipment');
const Alert = require('../models/Alert');
const AppError = require('../utils/AppError');

// Haversine formula to calculate distance between two points in km
const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const getNearestDealer = async (user) => {
    if (!user.coordinates || !user.coordinates.lat || !user.coordinates.lng) {
        // Fallback to any dealer if user has no coords
        const dealer = await Location.findOne({ type: 'dealer', companyId: user.companyId });
        if (!dealer) throw new AppError('No dealers found for this company', 404);
        return dealer;
    }

    const dealers = await Location.find({ type: 'dealer', companyId: user.companyId });
    if (dealers.length === 0) throw new AppError('No dealers found for this company', 404);

    let nearest = dealers[0];
    let minDistance = getDistance(user.coordinates.lat, user.coordinates.lng, nearest.coordinates.lat, nearest.coordinates.lng);

    for (let i = 1; i < dealers.length; i++) {
        const dist = getDistance(user.coordinates.lat, user.coordinates.lng, dealers[i].coordinates.lat, dealers[i].coordinates.lng);
        if (dist < minDistance) {
            minDistance = dist;
            nearest = dealers[i];
        }
    }

    return nearest;
};

const getProductCatalog = async (user, filters = {}) => {
    const dealer = await getNearestDealer(user);
    const query = { companyId: user.companyId };
    
    if (filters.category) query.category = filters.category;
    if (filters.search) query.name = { $regex: filters.search, $options: 'i' };
    if (filters.minPrice || filters.maxPrice) {
        query.price = {};
        if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
        if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
    }

    const products = await Product.find(query);
    const inventory = await Inventory.find({ locationId: dealer._id, companyId: user.companyId });
    const inventoryMap = {};
    inventory.forEach(inv => {
        inventoryMap[inv.productId.toString()] = inv.availableStock;
    });

    return products.map(p => ({
        ...p.toObject(),
        availableStock: inventoryMap[p._id.toString()] || 0,
        dealerLocation: {
            id: dealer._id,
            name: dealer.name,
            address: dealer.address
        }
    }));
};

const getProductDetails = async (user, productId) => {
    const product = await Product.findOne({ _id: productId, companyId: user.companyId });
    if (!product) throw new AppError('Product not found', 404);

    const dealer = await getNearestDealer(user);
    const inventory = await Inventory.findOne({ productId, locationId: dealer._id });
    
    const activeCoupons = await Coupon.find({
        companyId: user.companyId,
        isActive: true,
        validUntil: { $gt: new Date() }
    });

    return {
        product,
        availableStock: inventory ? inventory.availableStock : 0,
        dealerLocation: dealer,
        activeCoupons
    };
};

const getOrderSummary = async (user) => {
    const orders = await Order.find({ customerId: user._id, companyId: user.companyId });
    
    const totalOrders = orders.length;
    const totalSpending = orders.reduce((acc, curr) => acc + (curr.status !== 'cancelled' ? curr.totalAmount : 0), 0);
    
    const productCounts = {};
    orders.forEach(order => {
        if (order.status !== 'cancelled') {
            order.items.forEach(item => {
                const pid = item.productId.toString();
                productCounts[pid] = (productCounts[pid] || 0) + item.quantity;
            });
        }
    });

    // Sort products by quantity
    const sortedProducts = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const mostOrderedProducts = await Promise.all(sortedProducts.map(async ([pid, qty]) => {
        const product = await Product.findById(pid).select('name sku');
        return { product, quantity: qty };
    }));

    return {
        totalOrders,
        totalSpending,
        mostOrderedProducts
    };
};

const getOrderTracking = async (user, orderId) => {
    const order = await Order.findOne({ _id: orderId, customerId: user._id });
    if (!order) throw new AppError('Order not found', 404);

    const shipment = await Shipment.findOne({ orderId: order._id });
    
    return {
        orderId: order._id,
        status: order.status,
        shipment: shipment ? {
            trackingNumber: shipment.trackingNumber,
            carrier: shipment.carrier,
            status: shipment.status,
            estimatedDelivery: shipment.estimatedDelivery,
            actualDelivery: shipment.actualDelivery,
            timeline: [
                { status: 'Order Placed', time: order.createdAt },
                shipment.createdAt ? { status: 'Shipment Created', time: shipment.createdAt } : null,
                shipment.actualDelivery ? { status: 'Delivered', time: shipment.actualDelivery } : null
            ].filter(Boolean)
        } : null
    };
};

module.exports = {
    getNearestDealer,
    getProductCatalog,
    getProductDetails,
    getOrderSummary,
    getOrderTracking
};
