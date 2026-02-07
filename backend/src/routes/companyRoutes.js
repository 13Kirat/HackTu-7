const express = require('express');
const router = express.Router();
const { createCompany, getCompany } = require('../controllers/companyController');
const { protect } = require('../middlewares/authMiddleware');

// Public route to onboard new companies? Or Super Admin only?
// Let's make it public for demo purposes or secured by a secret key in header if strictly internal.
router.post('/', createCompany); 
router.get('/:id', protect, getCompany);

module.exports = router;