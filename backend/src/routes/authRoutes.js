const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getProfile } = require('../controllers/authController');
const { protect, checkRole } = require('../middlewares/authMiddleware'); // Wait, checkRole is separate
const { checkRole: roleCheck } = require('../middlewares/roleMiddleware');

// Fix import structure if needed, or consolidate.
// Assuming protect is in authMiddleware and checkRole is in roleMiddleware

router.post('/login', loginUser);
router.post('/register', protect, roleCheck(['manage_users', 'admin']), registerUser);
router.get('/profile', protect, getProfile);

module.exports = router;