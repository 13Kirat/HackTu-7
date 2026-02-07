const express = require('express');
const router = express.Router();
const { getLocations, createLocation } = require('../controllers/companyController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getLocations);
router.post('/', createLocation);

module.exports = router;
