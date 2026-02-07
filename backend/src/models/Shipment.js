const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  trackingNumber: { type: String },
  carrier: { type: String },
  status: { type: String, enum: ['pending', 'in_transit', 'delivered', 'returned'], default: 'pending' },
  estimatedDelivery: { type: Date },
  actualDelivery: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);
