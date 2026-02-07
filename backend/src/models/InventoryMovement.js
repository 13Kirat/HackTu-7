const mongoose = require('mongoose');

const inventoryMovementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  fromLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }, // Null for production
  toLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }, // Null for external sale
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['production', 'transfer_in', 'transfer_out', 'sale', 'adjustment_add', 'adjustment_sub', 'return', 'fulfill_reservation'], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId }, // e.g., Order ID or Shipment ID
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('InventoryMovement', inventoryMovementSchema);
