const axios = require('axios');
const Forecast = require('../models/Forecast');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const getDemandForecast = async (companyId, productId, locationId) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict-demand`, {
      product_id: productId,
      location_id: locationId
    });
    
    const prediction = response.data.prediction;
    
    // Save to DB
    await Forecast.create({
      companyId,
      productId,
      locationId,
      forecastDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      predictedDemand: prediction
    });

    return prediction;
  } catch (error) {
    console.warn('AI Service unavailable, returning mock forecast');
    // Mock logic
    return Math.floor(Math.random() * 100) + 50; 
  }
};

const getStockRecommendation = async (locationId) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/stock-recommendation`, {
      location_id: locationId
    });
    return response.data;
  } catch (error) {
    console.warn('AI Service unavailable, returning mock recommendation');
    return {
      recommended_restock: [
        { product_id: 'mock_product_1', quantity: 50, priority: 'high' }
      ]
    };
  }
};

module.exports = {
  getDemandForecast,
  getStockRecommendation
};
