const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  forecastDate: { type: Date, required: true }, // The date needed
  predictedDemand: { type: Number, required: true },
  confidenceScore: { type: Number },
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// forecastSchema.index({ companyId: 1, productId: 1, locationId: 1 }, { unique: true });
// forecastSchema.index({ companyId: 1, forecastDate: 1 });

module.exports = mongoose.model('Forecast', forecastSchema);
