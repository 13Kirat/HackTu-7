const User = require('../models/User');
const Role = require('../models/Role');
const AppError = require('../utils/AppError');

const createUser = async (req, res, next) => {
    try {
        let { name, email, password, role, locationId } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) throw new AppError('User already exists', 400);

        // If role is a name string, find the ID
        let roleId = role;
        if (typeof role === 'string' && role.length !== 24) {
            const foundRole = await Role.findOne({ name: role });
            if (!foundRole) throw new AppError(`Role ${role} not found`, 404);
            roleId = foundRole._id;
        }

        const user = await User.create({
            name,
            email,
            password,
            role: roleId,
            companyId: req.user.companyId,
            locationId: locationId === 'unassigned' ? null : locationId
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
        
        let { name, email, role, locationId, isActive } = req.body;
        
        if (name) user.name = name;
        if (email) user.email = email;
        
        if (role) {
            let roleId = role;
            if (typeof role === 'string' && role.length !== 24) {
                const foundRole = await Role.findOne({ name: role });
                if (foundRole) roleId = foundRole._id;
            }
            user.role = roleId;
        }

        if (typeof locationId !== 'undefined') {
            user.locationId = locationId === 'unassigned' ? null : locationId;
        }
        
        if (typeof isActive !== 'undefined') user.isActive = isActive;

        await user.save();
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
        if (!user) throw new AppError('User not found', 404);
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser };
