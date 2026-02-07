const Product = require('../models/Product');
const AppError = require('../utils/AppError');

const createProduct = async (req, res, next) => {
  try {
    const { name, sku, description, category, price, costPrice, attributes } = req.body;
    const product = await Product.create({
      name,
      sku,
      description,
      category,
      price,
      costPrice,
      attributes,
      companyId: req.user.companyId
    });
    res.status(201).json(product);
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

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, companyId: req.user.companyId });
    if (!product) throw new AppError('Product not found', 404);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, companyId: req.user.companyId });
    if (!product) throw new AppError('Product not found', 404);

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    if (!product) throw new AppError('Product not found', 404);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct };
