const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const predictDemand = async (productId, locationId, historicalSales) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/predict-demand`, {
            productId,
            locationId,
            historicalSales
        });
        return response.data.predictedDemand;
    } catch (error) {
        console.warn('AI Service (predict-demand) error, using fallback');
        return Math.floor(Math.random() * 100) + 50;
    }
};

const getStockRecommendations = async (locationId) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/stock-recommendation`, {
            location_id: locationId
        });
        return response.data;
    } catch (error) {
        console.warn('AI Service (stock-recommendation) error');
        return null;
    }
};

module.exports = {
    predictDemand,
    getStockRecommendations
};
