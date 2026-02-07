const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., 'Company Admin', 'Factory Manager', 'Dealer'
  permissions: [{ type: String }], // e.g., 'read_product', 'create_order'
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  isSystemRole: { type: Boolean, default: false } // For super admins or default roles
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
