const Alert = require('../models/Alert');
const Inventory = require('../models/Inventory');
const Forecast = require('../models/Forecast');

const checkAndTriggerAlerts = async (companyId, locationId, productId) => {
  const query = { companyId };
  if (locationId) query.locationId = locationId;
  if (productId) query.productId = productId;

  const inventoryItems = await Inventory.find(query)
    .populate('productId', 'name')
    .populate('locationId', 'name');

  for (const item of inventoryItems) {
    // 1. Low Stock Alert
    if (item.availableStock < item.reorderLevel) {
      await createAlertIfNotExists(
        companyId,
        'low_stock',
        `Low stock for ${item.productId.name} at ${item.locationId.name}. Available: ${item.availableStock}, Reorder Level: ${item.reorderLevel}`,
        item.locationId._id,
        item.productId._id
      );
    }

    // 2. High Demand & Overstock Alerts (using Forecast)
    const forecast = await Forecast.findOne({
      companyId,
      locationId: item.locationId._id,
      productId: item.productId._id
    });

    if (forecast) {
      if (forecast.predictedDemand > item.availableStock) {
        await createAlertIfNotExists(
          companyId,
          'high_demand',
          `High demand predicted for ${item.productId.name} at ${item.locationId.name}. Predicted: ${forecast.predictedDemand}, Available: ${item.availableStock}`,
          item.locationId._id,
          item.productId._id
        );
      } else if (item.availableStock > (2 * forecast.predictedDemand) && forecast.predictedDemand > 0) {
        await createAlertIfNotExists(
          companyId,
          'overstock',
          `Overstock detected for ${item.productId.name} at ${item.locationId.name}. Available: ${item.availableStock}, Predicted Demand: ${forecast.predictedDemand}`,
          item.locationId._id,
          item.productId._id
        );
      }
    }
  }
};

const createAlertIfNotExists = async (companyId, type, message, locationId, productId) => {
  // Check for unresolved alert of same type for same product/location in last 24h to avoid spam
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const existingAlert = await Alert.findOne({
    companyId,
    type,
    productId,
    locationId,
    status: 'active',
    createdAt: { $gte: oneDayAgo }
  });

  if (!existingAlert) {
    await Alert.create({
      companyId,
      type,
      message,
      locationId,
      productId,
      status: 'active',
      severity: type === 'low_stock' ? 'high' : 'medium'
    });
  }
};

module.exports = {
  checkAndTriggerAlerts
};
