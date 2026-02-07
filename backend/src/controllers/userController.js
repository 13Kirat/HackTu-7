const User = require('../models/User');
const AppError = require('../utils/AppError');

const createUser = async (req, res, next) => {
    // Re-using logic or calling authController logic.
    // Let's implement specific admin creation logic here
    try {
        const { name, email, password, roleId, locationId } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) throw new AppError('User already exists', 400);

        const user = await User.create({
            name,
            email,
            password,
            role: roleId,
            companyId: req.user.companyId,
            locationId
        });
        
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ companyId: req.user.companyId }).populate('role').populate('locationId');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id, companyId: req.user.companyId }).populate('role');
        if (!user) throw new AppError('User not found', 404);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id, companyId: req.user.companyId });
        if (!user) throw new AppError('User not found', 404);
        
        const { name, email, roleId, locationId, isActive } = req.body;
        
        if (name) user.name = name;
        if (email) user.email = email;
        if (roleId) user.role = roleId;
        if (locationId) user.locationId = locationId;
        if (typeof isActive !== 'undefined') user.isActive = isActive;

        await user.save();
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id, companyId: req.user.companyId });
        if (!user) throw new AppError('User not found', 404);
        
        // Soft delete usually, but here request says Deactivate or Delete.
        // Let's soft delete by setting isActive: false if deleteUser means deactivate, or remove.
        // Prompt says "Deactivate user".
        user.isActive = false;
        await user.save();
        res.json({ message: 'User deactivated' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser };
