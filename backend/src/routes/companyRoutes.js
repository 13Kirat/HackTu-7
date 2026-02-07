const express = require('express');
const router = express.Router();
const { createCompany } = require('../controllers/companyController');

// Public or Super Admin only
router.post('/', createCompany);

module.exports = router;
