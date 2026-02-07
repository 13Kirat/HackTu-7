const Alert = require('../models/Alert');
const AppError = require('../utils/AppError');

const getAlerts = async (req, res, next) => {
    try {
        // Filter by location if passed, else company wide
        const query = { companyId: req.user.companyId };
        // If query params has locationId
        if (req.query.locationId) {
            // Logic to link alert to location?
            // Alert schema has relatedEntity. If that's Location, works.
            // If relatedEntity is Product, we don't know location easily.
            // Assuming Alerts are company wide for now unless refined.
        }
        
        const alerts = await Alert.find(query).sort({ createdAt: -1 });
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
