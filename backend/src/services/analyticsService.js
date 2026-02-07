const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

const getStockAnalysis = async (companyId) => {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  // 1. Get total quantity sold per product in last 90 days
  const salesData = await Order.aggregate([
    { 
      $match: { 
        companyId, 
        status: { $in: ['shipped', 'delivered'] },
        createdAt: { $gte: ninetyDaysAgo }
      } 
    },
    { $unwind: '$items' },
    { 
      $group: {
        _id: '$items.productId',
        totalSold: { $sum: '$items.quantity' }
      }
    }
  ]);

  const salesMap = {};
  salesData.forEach(item => {
    salesMap[item._id.toString()] = item.totalSold;
  });

  // 2. Fetch all products
  const products = await Product.find({ companyId });

  const analysis = {
    fastMoving: [],
    slowMoving: [],
    deadStock: []
  };

  const FAST_THRESHOLD = 100; // Example threshold
  const SLOW_THRESHOLD = 10;

  products.forEach(product => {
    const sold = salesMap[product._id.toString()] || 0;
    const productInfo = {
      _id: product._id,
      name: product.name,
      sku: product.sku,
      totalSold: sold
    };

    if (sold >= FAST_THRESHOLD) {
      analysis.fastMoving.push(productInfo);
    } else if (sold > 0) {
      analysis.slowMoving.push(productInfo);
    } else {
      analysis.deadStock.push(productInfo);
    }
  });

  return analysis;
};

const getImbalances = async (companyId) => {
    // This could also use Forecast data if available
    // For now, let's use the simple reorderLevel logic + a basic overstock logic
    
    const inventory = await Inventory.find({ companyId })
        .populate('productId', 'name sku')
        .populate('locationId', 'name type');

    const shortages = inventory.filter(item => item.availableStock < item.reorderLevel);
    
    // Overstock: availableStock > 2 * reorderLevel (as a placeholder for 2 * predictedDemand)
    // We'll refine this once we have forecasts integrated.
    const overstock = inventory.filter(item => item.availableStock > (item.reorderLevel * 10)); 

    return { shortages, overstock };
};

const getSalesAnalytics = async (companyId) => {
    return await Order.aggregate([
        { $match: { companyId, status: { $ne: 'cancelled' } } },
        { $unwind: '$items' },
        { $group: {
            _id: {
                productId: '$items.productId',
                month: { $month: '$createdAt' },
                year: { $year: '$createdAt' }
            },
            totalQuantity: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.priceAtTime'] } }
        }},
        { $lookup: {
            from: 'products',
            localField: '_id.productId',
            foreignField: '_id',
            as: 'product'
        }},
        { $unwind: '$product' },
        { $project: {
            productId: '$_id.productId',
            productName: '$product.name',
            month: '$_id.month',
            year: '$_id.year',
            totalQuantity: 1,
            totalRevenue: 1
        }},
        { $sort: { year: -1, month: -1 } }
    ]);
};

module.exports = {
  getStockAnalysis,
  getImbalances,
  getSalesAnalytics
};
