const aiService = require('../services/aiService');
const Forecast = require('../models/Forecast');

const getDemandForecast = async (req, res, next) => {
  try {
    const { productId, locationId } = req.body;
    const prediction = await aiService.getDemandForecast(req.user.companyId, productId, locationId);
    res.json({ productId, locationId, predictedDemand: prediction });
  } catch (error) {
    next(error);
  }
};

const getForecasts = async (req, res, next) => {
    try {
        const forecasts = await Forecast.find({ companyId: req.user.companyId })
            .populate('productId', 'name')
            .populate('locationId', 'name')
            .sort({ createdAt: -1 });
        res.json(forecasts);
    } catch (error) {
        next(error);
    }
};

const getStockRecommendation = async (req, res, next) => {
  try {
    const { locationId } = req.body; // Changed from query to body to match prompt style or keep consistent?
    // Prompt says "Stock Recommendation POST /ai/recommendations"
    // So body is appropriate.
    
    // If body is empty try query?
    const locId = locationId || req.query.locationId;
    
    const recommendation = await aiService.getStockRecommendation(locId);
    res.json(recommendation);
  } catch (error) {
    next(error);
  }
};

const getSalesTrends = async (req, res, next) => {
    try {
        // Dummy AI Logic
        res.json({
            trend: 'upward',
            nextMonthProjection: '+15%',
            keyDrivers: ['Seasonality', 'New Product Launch']
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getDemandForecast, getForecasts, getStockRecommendation, getSalesTrends };