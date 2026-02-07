const mongoose = require('mongoose');

const inventoryMovementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  fromLocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }, 
  toLocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }, 
  quantity: { type: Number, required: true },
  movementType: { 
    type: String, 
    enum: ['manufacture', 'transfer', 'sale', 'return', 'adjustment'], 
    required: true 
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

inventoryMovementSchema.index({ companyId: 1, createdAt: -1 });
inventoryMovementSchema.index({ productId: 1, companyId: 1 });
inventoryMovementSchema.index({ fromLocationId: 1 });
inventoryMovementSchema.index({ toLocationId: 1 });

module.exports = mongoose.model('InventoryMovement', inventoryMovementSchema);
