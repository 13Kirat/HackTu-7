const express = require('express');
const router = express.Router();
const { getAlerts, resolveAlert } = require('../controllers/alertController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getAlerts);
router.put('/:id/resolve', resolveAlert);

module.exports = router;
