const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  orderType: { type: String, enum: ['dealer_order', 'customer_order'], required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  fromLocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }, 
  toLocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }, 
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtTime: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'failed'], 
    default: 'pending' 
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  couponCode: { type: String }
}, { timestamps: true });

orderSchema.index({ companyId: 1, createdAt: -1 });
orderSchema.index({ customerId: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
