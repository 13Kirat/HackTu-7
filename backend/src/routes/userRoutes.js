const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validate');
const { userSchemas } = require('../utils/validation');

router.use(protect);
router.use(checkRole(['manage_users', 'admin']));

router.post('/', validate(userSchemas.createUser), createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
