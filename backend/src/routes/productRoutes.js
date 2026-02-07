const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/companyController'); // Reusing controller for now
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getProducts);
router.post('/', createProduct);

module.exports = router;
