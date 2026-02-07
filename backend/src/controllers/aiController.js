const aiService = require('../services/aiService');

const getDemandForecast = async (req, res, next) => {
  try {
    const { productId, locationId } = req.body;
    const prediction = await aiService.getDemandForecast(req.user.companyId, productId, locationId);
    res.json({ productId, locationId, predictedDemand: prediction });
  } catch (error) {
    next(error);
  }
};

const getStockRecommendation = async (req, res, next) => {
  try {
    const { locationId } = req.query;
    const recommendation = await aiService.getStockRecommendation(locationId);
    res.json(recommendation);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDemandForecast, getStockRecommendation };
