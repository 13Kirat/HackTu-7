const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('./src/models/Company');
const Role = require('./src/models/Role');
const User = require('./src/models/User');
const Location = require('./src/models/Location');
const Product = require('./src/models/Product');
const Inventory = require('./src/models/Inventory');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await Company.deleteMany({});
    await Role.deleteMany({});
    await User.deleteMany({});
    await Location.deleteMany({});
    await Product.deleteMany({});
    await Inventory.deleteMany({});

    // 1. Create Company
    const company = await Company.create({
      name: 'TechLogistics Global',
      contactEmail: 'admin@techlogistics.com'
    });

    // 2. Create Roles
    const roles = await Role.insertMany([
      { name: 'Company Admin', permissions: ['all'], companyId: company._id },
      { name: 'Factory Manager', permissions: ['create_inventory', 'update_inventory', 'view_orders'], companyId: company._id },
      { name: 'Dealer', permissions: ['create_order', 'view_products'], companyId: company._id }
    ]);

    const adminRole = roles.find(r => r.name === 'Company Admin');
    const factoryRole = roles.find(r => r.name === 'Factory Manager');

    // 3. Create Locations
    const factory = await Location.create({
      name: 'Main Factory Shanghai',
      type: 'factory',
      address: '123 Industrial Park, Shanghai',
      companyId: company._id
    });

    const warehouse = await Location.create({
      name: 'Distribution Hub NY',
      type: 'warehouse',
      address: '456 Logistics Blvd, NY',
      companyId: company._id
    });

    // 4. Create Users
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: adminRole._id,
      companyId: company._id
    });

    await User.create({
      name: 'Factory Manager Bob',
      email: 'bob@example.com',
      password: 'password123',
      role: factoryRole._id,
      companyId: company._id,
      locationId: factory._id
    });

    // 5. Create Products
    const products = await Product.insertMany([
      { name: 'Smart Watch X1', sku: 'SW-X1', price: 150, companyId: company._id },
      { name: 'Wireless Earbuds', sku: 'WE-PRO', price: 80, companyId: company._id }
    ]);

    // 6. Initial Inventory
    await Inventory.create({
      productId: products[0]._id,
      locationId: factory._id,
      companyId: company._id,
      totalStock: 1000,
      availableStock: 1000
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

seedData();
