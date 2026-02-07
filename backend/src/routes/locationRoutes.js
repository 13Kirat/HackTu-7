const express = require('express');
const router = express.Router();
const { createLocation, getLocations, getLocation, updateLocation, deleteLocation } = require('../controllers/locationController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validate');
const { locationSchemas } = require('../utils/validation');

router.use(protect);

router.post('/', checkRole(['manage_locations', 'admin']), validate(locationSchemas.createLocation), createLocation);
router.get('/', getLocations);
router.get('/:id', getLocation);
router.put('/:id', checkRole(['manage_locations', 'admin']), updateLocation);
router.delete('/:id', checkRole(['manage_locations', 'admin']), deleteLocation);

module.exports = router;