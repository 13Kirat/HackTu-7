const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  type: { type: String, enum: ['low_stock', 'high_demand', 'shipment_delay', 'system'], required: true },
  message: { type: String, required: true },
  relatedEntity: { type: mongoose.Schema.Types.ObjectId }, // ProductID, OrderID, etc.
  relatedModel: { type: String }, // 'Product', 'Order'
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
