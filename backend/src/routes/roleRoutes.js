const express = require('express');
const router = express.Router();
const { createRole, getRoles, updateRole, deleteRole } = require('../controllers/roleController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

router.use(protect);
router.use(checkRole(['manage_roles', 'admin']));

router.post('/', createRole);
router.get('/', getRoles);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
