const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  price: { type: Number, required: true },
  costPrice: { type: Number }, // For internal calculations
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  schemes: [{ type: String }], // e.g., ['Buy 10 Get 1', 'Winter Discount']
  attributes: { type: Map, of: String } // e.g., color, size
}, { timestamps: true });

// Compound index for unique SKU per company
productSchema.index({ sku: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema);
