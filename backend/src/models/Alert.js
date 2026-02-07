const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  type: { type: String, enum: ['low_stock', 'high_demand', 'overstock', 'shipment_delay', 'system'], required: true },
  message: { type: String, required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  severity: { type: String, enum: ['info', 'low', 'medium', 'high', 'critical'], default: 'info' }
}, { timestamps: true });

// alertSchema.index({ companyId: 1, status: 1 });
// alertSchema.index({ companyId: 1, type: 1, productId: 1, locationId: 1, status: 1 });

module.exports = mongoose.model('Alert', alertSchema);
