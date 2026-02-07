const express = require('express');
const router = express.Router();
const { getDemandForecast, getForecasts, getStockRecommendation, getSalesTrends } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/forecast', getDemandForecast);
router.get('/forecasts', getForecasts);
router.post('/replenishment', getStockRecommendation);
 // Changed to POST per prompt 14.3
router.get('/sales-trends', getSalesTrends);

module.exports = router;