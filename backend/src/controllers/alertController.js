const Alert = require('../models/Alert');
const AppError = require('../utils/AppError');

const getAlerts = async (req, res, next) => {
    try {
        const { locationId, productId, status, type } = req.query;
        const query = { companyId: req.user.companyId };
        
        if (locationId) query.locationId = locationId;
        if (productId) query.productId = productId;
        if (status) query.status = status;
        if (type) query.type = type;
        
        const alerts = await Alert.find(query)
            .populate('productId', 'name sku')
            .populate('locationId', 'name type')
            .sort({ createdAt: -1 });
        res.json(alerts);
    } catch (error) {
        next(error);
    }
};

const resolveAlert = async (req, res, next) => {
    try {
        const alert = await Alert.findOne({ _id: req.params.id, companyId: req.user.companyId });
        if (!alert) throw new AppError('Alert not found', 404);
        
        alert.status = 'resolved';
        await alert.save();
        res.json(alert);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAlerts, resolveAlert };
