const Forecast = require('../models/Forecast');
const Inventory = require('../models/Inventory');
const Order = require('../models/Order');
const alertService = require('./alertService');
const aiClient = require('../ai/aiClient');

const getDemandForecast = async (companyId, productId, locationId) => {
  try {
    // 1. Fetch historical sales data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const salesData = await Order.aggregate([
      { 
        $match: { 
          companyId, 
          fromLocationId: locationId,
          status: { $in: ['shipped', 'delivered'] },
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      { $unwind: '$items' },
      { $match: { 'items.productId': productId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalSold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const historicalSales = salesData.map(d => ({
      month: `${d._id.year}-${d._id.month}`,
      quantity: d.totalSold
    }));

    // 2. Call AI Client
    const prediction = await aiClient.predictDemand(productId, locationId, historicalSales);
    
    // 3. Save to DB
    await Forecast.findOneAndUpdate(
      { companyId, productId, locationId },
      {
        forecastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next month
        predictedDemand: prediction
      },
      { upsert: true, new: true }
    );

    // Check for alerts
    alertService.checkAndTriggerAlerts(companyId, locationId, productId).catch(err => console.error('Alert trigger error:', err));

    return prediction;
  } catch (error) {
    console.error('Error in getDemandForecast service:', error);
    throw error;
  }
};

const getForecasts = async (companyId) => {
    return await Forecast.find({ companyId })
        .populate('productId', 'name')
        .populate('locationId', 'name')
        .sort({ createdAt: -1 });
};

const getStockRecommendation = async (locationId) => {
  try {
    // 1. Fetch all forecasts for this location
    const forecasts = await Forecast.find({ locationId }).populate('productId', 'name sku');
    
    // 2. Fetch all inventory for this location
    const inventory = await Inventory.find({ locationId });
    const inventoryMap = {};
    inventory.forEach(item => {
      inventoryMap[item.productId.toString()] = item.availableStock;
    });

    const recommendations = [];

    // 3. Apply formula: predictedDemand > availableStock
    for (const forecast of forecasts) {
      const available = inventoryMap[forecast.productId._id.toString()] || 0;
      
      if (forecast.predictedDemand > available) {
        recommendations.push({
          productId: forecast.productId._id,
          productName: forecast.productId.name,
          sku: forecast.productId.sku,
          availableStock: available,
          predictedDemand: forecast.predictedDemand,
          recommendedRestock: forecast.predictedDemand - available,
          priority: (forecast.predictedDemand - available) > 100 ? 'high' : 'medium'
        });
      }
    }

    // Also call AI client for any external model insights
    const aiInsights = await aiClient.getStockRecommendations(locationId);

    return {
      locationId,
      recommendations,
      aiInsights
    };
  } catch (error) {
    console.error('Error generating stock recommendations:', error);
    throw error;
  }
};

module.exports = {
  getDemandForecast,
  getForecasts,
  getStockRecommendation
};
