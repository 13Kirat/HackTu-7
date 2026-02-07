const Company = require('../models/Company');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const Role = require('../models/Role');

const createCompany = async (req, res, next) => {
  try {
    const { name, address, contactEmail, phone, adminEmail, adminPassword, adminName } = req.body;
    
    if (!name || !adminEmail || !adminPassword) {
        throw new AppError('Company name and Admin details are required', 400);
    }

    // 1. Create Company
    const company = await Company.create({
      name,
      address,
      contactEmail,
      phone
    });

    // 2. Create Admin Role for this company
    const adminRole = await Role.create({
        name: 'Company Admin',
        permissions: ['all'],
        companyId: company._id,
        isSystemRole: true
    });

    // 3. Create Admin User
    const adminUser = await User.create({
        name: adminName || 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: adminRole._id,
        companyId: company._id
    });

    res.status(201).json({ company, adminUser });
  } catch (error) {
    next(error);
  }
};

const getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) throw new AppError('Company not found', 404);
    
    // Security check: only allow own company unless super admin
    if (req.user.companyId.toString() !== req.params.id && req.user.role.name !== 'Super Admin') {
        throw new AppError('Not authorized to view this company', 403);
    }

    res.json(company);
  } catch (error) {
    next(error);
  }
};

module.exports = { createCompany, getCompany };