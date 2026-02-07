const User = require('../models/User');
const Role = require('../models/Role');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('role');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        companyId: user.companyId,
        role: user.role.name,
        permissions: user.role.permissions,
        token: generateToken(user._id),
      });
    } else {
      throw new AppError('Invalid email or password', 401);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user (Usually done by Admin, but keeping for initial setup/testing)
// @route   POST /api/auth/register
// @access  Public/Admin
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, roleId, companyId, locationId } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new AppError('User already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      role: roleId,
      companyId,
      locationId
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        companyId: user.companyId,
        token: generateToken(user._id),
      });
    } else {
      throw new AppError('Invalid user data', 400);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser, registerUser };
