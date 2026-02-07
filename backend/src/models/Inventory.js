const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  totalStock: { type: Number, default: 0, min: 0 },
  reservedStock: { type: Number, default: 0, min: 0 },
  availableStock: { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 10 }
}, { timestamps: true });

inventorySchema.pre('save', function() {
  this.availableStock = this.totalStock - this.reservedStock;
});

// Ensure one inventory record per product per location
inventorySchema.index({ productId: 1, locationId: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);
