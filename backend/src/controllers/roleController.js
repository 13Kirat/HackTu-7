const Role = require('../models/Role');
const AppError = require('../utils/AppError');

const createRole = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.create({
      name,
      permissions,
      companyId: req.user.companyId
    });
    res.status(201).json(role);
  } catch (error) {
    next(error);
  }
};

const getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find({ companyId: req.user.companyId });
    res.json(roles);
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, companyId: req.user.companyId });
    if (!role) throw new AppError('Role not found', 404);
    
    Object.assign(role, req.body);
    await role.save();
    res.json(role);
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    if (!role) throw new AppError('Role not found', 404);
    res.json({ message: 'Role deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRole, getRoles, updateRole, deleteRole };
