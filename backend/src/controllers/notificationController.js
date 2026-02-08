const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');

const createNotification = async (req, res, next) => {
    try {
        const { title, message, type, targetRoles } = req.body;
        const notification = await Notification.create({
            title,
            message,
            type,
            targetRoles,
            companyId: req.user.companyId,
            createdBy: req.user._id
        });
        res.status(201).json(notification);
    } catch (error) {
        next(error);
    }
};

const getNotifications = async (req, res, next) => {
    try {
        const query = { companyId: req.user.companyId, isActive: true };
        
        // If not admin, only show notifications targeted at their role
        if (req.user.role.name !== 'Company Admin' && req.user.role.name !== 'Super Admin') {
            query.$or = [
                { targetRoles: { $in: [req.user.role.name] } },
                { targetRoles: { $size: 0 } } // Public if empty
            ];
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        next(error);
    }
};

const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndDelete({ 
            _id: req.params.id, 
            companyId: req.user.companyId 
        });
        if (!notification) throw new AppError('Notification not found', 404);
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createNotification, getNotifications, deleteNotification };
