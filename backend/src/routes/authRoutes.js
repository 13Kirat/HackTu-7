const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware'); 
const { checkRole: roleCheck } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validate');
const { authSchemas } = require('../utils/validation');

router.post('/login', validate(authSchemas.login), loginUser);
router.post('/register', protect, roleCheck(['manage_users', 'admin']), registerUser);
router.get('/profile', protect, getProfile);

module.exports = router;