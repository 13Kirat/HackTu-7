const Joi = require('joi');

const authSchemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

const userSchemas = {
  createUser: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().hex().length(24).required(),
    locationId: Joi.string().hex().length(24).optional()
  })
};

const locationSchemas = {
  createLocation: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('factory', 'warehouse', 'dealer').required(),
    address: Joi.string().required()
  })
};

const orderSchemas = {
  createOrder: Joi.object({
    fromLocationId: Joi.string().hex().length(24).required(),
    toLocationId: Joi.string().hex().length(24).optional(),
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().hex().length(24).required(),
        quantity: Joi.number().min(1).required()
      })
    ).min(1).required()
  })
};

const inventorySchemas = {
  updateStock: Joi.object({
    productId: Joi.string().hex().length(24).required(),
    locationId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().required(),
    type: Joi.string().valid('manufacture', 'transfer', 'sale', 'return', 'adjustment').required()
  }),
  transferStock: Joi.object({
    productId: Joi.string().hex().length(24).required(),
    fromLocationId: Joi.string().hex().length(24).required(),
    toLocationId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().min(1).required()
  })
};

const productSchemas = {
  createProduct: Joi.object({
    name: Joi.string().required(),
    sku: Joi.string().required(),
    description: Joi.string().optional(),
    category: Joi.string().required(),
    price: Joi.number().min(0).required(),
    costPrice: Joi.number().min(0).required(),
    attributes: Joi.object().optional()
  })
};

const roleSchemas = {
  createRole: Joi.object({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string()).required()
  })
};

const couponSchemas = {
  createCoupon: Joi.object({
    code: Joi.string().required(),
    discountType: Joi.string().valid('percentage', 'fixed').required(),
    discountValue: Joi.number().required(),
    minOrderValue: Joi.number().min(0).default(0),
    validUntil: Joi.date().greater('now').optional()
  })
};

const buyerSchemas = {
  updateProfile: Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    coordinates: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required()
    }).optional()
  }),
  placeOrder: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().hex().length(24).required(),
        quantity: Joi.number().min(1).required()
      })
    ).min(1).required(),
    couponCode: Joi.string().optional()
  }),
  validateCoupon: Joi.object({
    couponCode: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().hex().length(24).required(),
        quantity: Joi.number().min(1).required()
      })
    ).min(1).required()
  })
};

module.exports = {
  authSchemas,
  userSchemas,
  locationSchemas,
  orderSchemas,
  inventorySchemas,
  productSchemas,
  roleSchemas,
  couponSchemas,
  buyerSchemas
};
