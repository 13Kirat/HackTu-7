const User = require('../models/User');
const Role = require('../models/Role');
const Company = require('../models/Company');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError('Please provide email and password', 400);

    const user = await User.findOne({ email }).populate('role');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        companyId: user.companyId,
        role: user.role ? user.role.name : 'Unknown',
        permissions: user.role ? user.role.permissions : [],
        token: generateToken(user._id),
      });
    } else {
      throw new AppError('Invalid email or password', 401);
    }
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    let { name, email, password, roleId, companyId, locationId } = req.body;
    
    // Fetch default role if not provided
    if (!roleId) {
        const defaultRole = await Role.findOne({ name: 'Buyer' });
        if (!defaultRole) throw new AppError('Default Buyer role not found', 500);
        roleId = defaultRole._id;
    }

    // Fetch default company if not provided
    if (!companyId) {
        const defaultCompany = await Company.findOne({});
        if (!defaultCompany) throw new AppError('Default Company not found', 500);
        companyId = defaultCompany._id;
    }

    // Simple validation
    if (!name || !email || !password) {
        throw new AppError('Missing required fields (name, email, password)', 400);
    }

    const userExists = await User.findOne({ email });
    if (userExists) throw new AppError('User already exists', 400);

    const user = await User.create({
      name,
      email,
      password,
      role: roleId,
      companyId,
      locationId
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      companyId: user.companyId,
      role: 'Buyer', // Assuming if we use default it is Buyer
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('role').populate('companyId').select('-password');
    if (!user) throw new AppError('User not found', 404);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new AppError('User not found', 404);
    const { name, email, phone, address, settings } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (settings) user.settings = { ...user.settings, ...settings };
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser, registerUser, getProfile, updateProfile };
