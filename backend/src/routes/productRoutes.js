const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

const validate = require('../middlewares/validate');
const { productSchemas } = require('../utils/validation');

router.use(protect);

router.post('/', checkRole(['manage_products', 'admin']), validate(productSchemas.createProduct), createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', checkRole(['manage_products', 'admin']), updateProduct);
router.delete('/:id', checkRole(['manage_products', 'admin']), deleteProduct);

module.exports = router;