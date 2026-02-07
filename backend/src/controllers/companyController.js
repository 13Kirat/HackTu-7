const Company = require('../models/Company');
const Location = require('../models/Location');
const Product = require('../models/Product');

const createCompany = async (req, res, next) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
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

const createLocation = async (req, res, next) => {
  try {
    const location = await Location.create({ ...req.body, companyId: req.user.companyId });
    res.status(201).json(location);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ companyId: req.user.companyId });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({ ...req.body, companyId: req.user.companyId });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCompany,
  getLocations,
  createLocation,
  getProducts,
  createProduct
};
