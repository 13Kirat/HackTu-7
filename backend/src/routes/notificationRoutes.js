const express = require('express');
const router = express.Router();
const { createNotification, getNotifications, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

router.use(protect);

router.post('/', checkRole(['admin']), createNotification);
router.get('/', getNotifications);
router.delete('/:id', checkRole(['admin']), deleteNotification);

module.exports = router;
