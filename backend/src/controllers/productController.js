const Product = require('../models/Product');
const AppError = require('../utils/AppError');

const createProduct = async (req, res, next) => {
  try {
    const { name, sku, description, category, price, costPrice, attributes, schemes } = req.body;
    const product = await Product.create({
      name,
      sku,
      description,
      category,
      price,
      costPrice,
      attributes,
      schemes,
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

    const { name, sku, description, category, price, costPrice, attributes, schemes } = req.body;
    if (name) product.name = name;
    if (sku) product.sku = sku;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = price;
    if (costPrice) product.costPrice = costPrice;
    if (attributes) product.attributes = attributes;
    if (schemes) product.schemes = schemes;

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
