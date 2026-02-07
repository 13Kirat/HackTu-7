const express = require('express');
const router = express.Router();
const { getDemandForecast, getStockRecommendation } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/forecast', getDemandForecast);
router.get('/recommendations', getStockRecommendation);

module.exports = router;
