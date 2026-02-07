const express = require('express');
const router = express.Router();
const { getSalesSummary, getStockInsights, getImbalances } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

router.use(protect);
router.use(checkRole(['view_analytics', 'admin']));

router.get('/sales', getSalesSummary);
router.get('/stock', getStockInsights);
router.get('/imbalances', getImbalances);

module.exports = router;
