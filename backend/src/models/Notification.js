const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['info', 'warning', 'success', 'error', 'system'], 
    default: 'info' 
  },
  targetRoles: [{ type: String }], // e.g., ['Dealer', 'Buyer']
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

notificationSchema.index({ companyId: 1, isActive: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
