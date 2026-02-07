const analyticsService = require('../services/analyticsService');

const getSalesSummary = async (req, res, next) => {
    try {
        const analytics = await analyticsService.getSalesAnalytics(req.user.companyId);
        res.json(analytics);
    } catch (error) {
        next(error);
    }
};

const getStockInsights = async (req, res, next) => {
    try {
        const insights = await analyticsService.getStockAnalysis(req.user.companyId);
        res.json(insights);
    } catch (error) {
        next(error);
    }
};

const getImbalances = async (req, res, next) => {
    try {
        const imbalances = await analyticsService.getImbalances(req.user.companyId);
        res.json(imbalances);
    } catch (error) {
        next(error);
    }
};

module.exports = { getSalesSummary, getStockInsights, getImbalances };
