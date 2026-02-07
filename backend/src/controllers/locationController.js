const Location = require('../models/Location');
const AppError = require('../utils/AppError');

const createLocation = async (req, res, next) => {
  try {
    const { name, type, address, coordinates, managerId } = req.body;
    const location = await Location.create({
      name,
      type,
      address,
      coordinates,
      managerId,
      companyId: req.user.companyId
    });
    res.status(201).json(location);
  } catch (error) {
    next(error);
  }
};

const getLocations = async (req, res, next) => {
  try {
    const locations = await Location.find({ companyId: req.user.companyId });
    res.json(locations);
  } catch (error) {
    next(error);
  }
};

const getLocation = async (req, res, next) => {
  try {
    const location = await Location.findOne({ _id: req.params.id, companyId: req.user.companyId });
    if (!location) throw new AppError('Location not found', 404);
    res.json(location);
  } catch (error) {
    next(error);
  }
};

const updateLocation = async (req, res, next) => {
  try {
    const location = await Location.findOne({ _id: req.params.id, companyId: req.user.companyId });
    if (!location) throw new AppError('Location not found', 404);

    Object.assign(location, req.body);
    await location.save();
    res.json(location);
  } catch (error) {
    next(error);
  }
};

const deleteLocation = async (req, res, next) => {
  try {
    const location = await Location.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    if (!location) throw new AppError('Location not found', 404);
    res.json({ message: 'Location deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createLocation, getLocations, getLocation, updateLocation, deleteLocation };
