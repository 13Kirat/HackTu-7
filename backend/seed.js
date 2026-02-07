const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('./src/models/Company');
const Role = require('./src/models/Role');
const User = require('./src/models/User');
const Location = require('./src/models/Location');
const Product = require('./src/models/Product');
const Inventory = require('./src/models/Inventory');
const Coupon = require('./src/models/Coupon');

dotenv.config();

const seedData = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // 1. Clear existing data
    console.log('Clearing old data...');
    await Promise.all([
        Company.deleteMany({}),
        Role.deleteMany({}),
        User.deleteMany({}),
        Location.deleteMany({}),
        Product.deleteMany({}),
        Inventory.deleteMany({}),
        Coupon.deleteMany({})
    ]);

    // 2. Create Company
    const company = await Company.create({
      name: 'NexGen Supply Chain Solutions',
      contactEmail: 'corp@nexgen.com',
      address: '101 Tech Blvd, San Francisco, CA'
    });
    console.log('Company created');

    // 3. Create Roles with specific permissions
    const rolesData = [
      { 
        name: 'Company Admin', 
        permissions: ['all'], 
        companyId: company._id, 
        isSystemRole: true 
      },
      { 
        name: 'Factory Manager', 
        permissions: ['view_inventory', 'create_inventory', 'update_inventory', 'transfer_inventory', 'view_orders', 'process_order'], 
        companyId: company._id 
      },
      { 
        name: 'Dealer', 
        permissions: ['create_order', 'view_products', 'view_inventory', 'update_shipment'], 
        companyId: company._id 
      },
      { 
        name: 'Buyer', 
        permissions: ['create_order', 'view_products'], 
        companyId: company._id 
      }
    ];
    const roles = await Role.insertMany(rolesData);
    console.log('Roles created');

    const adminRole = roles.find(r => r.name === 'Company Admin');
    const factoryRole = roles.find(r => r.name === 'Factory Manager');
    const dealerRole = roles.find(r => r.name === 'Dealer');
    const buyerRole = roles.find(r => r.name === 'Buyer');

    // 4. Create Locations
    const factory = await Location.create({
      name: 'Main Manufacturing Plant',
      type: 'factory',
      address: 'Industrial Zone East, SF',
      companyId: company._id
    });

    const warehouse = await Location.create({
      name: 'Regional Distribution Hub',
      type: 'warehouse',
      address: 'Logistics Park South, SF',
      companyId: company._id
    });

    const dealerLoc = await Location.create({
      name: 'Elite Electronics Retail',
      type: 'dealer',
      address: 'Downtown Shopping Center, SF',
      companyId: company._id
    });
    console.log('Locations created');

    // 5. Create Users
    const usersData = [
      {
        name: 'System Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: adminRole._id,
        companyId: company._id
      },
      {
        name: 'John Factory',
        email: 'factory@example.com',
        password: 'password123',
        role: factoryRole._id,
        companyId: company._id,
        locationId: factory._id
      },
      {
        name: 'David Dealer',
        email: 'dealer@example.com',
        password: 'password123',
        role: dealerRole._id,
        companyId: company._id,
        locationId: dealerLoc._id
      },
      {
        name: 'Alice Buyer',
        email: 'buyer@example.com',
        password: 'password123',
        role: buyerRole._id,
        companyId: company._id
      }
    ];

    // Note: User model has pre-save hook for password hashing
    for (const u of usersData) {
        await User.create(u);
    }
    console.log('Users created');

    // 6. Create Products
    const productsData = [
      { name: 'Ultra HD Monitor 32"', sku: 'MON-32-UHD', price: 499, costPrice: 250, companyId: company._id, category: 'Hardware' },
      { name: 'Mechanical Keyboard RGB', sku: 'KB-RGB-MECH', price: 129, costPrice: 60, companyId: company._id, category: 'Accessories' },
      { name: 'Wireless Pro Mouse', sku: 'MSE-WRLS-PRO', price: 89, costPrice: 40, companyId: company._id, category: 'Accessories' }
    ];
    const products = await Product.insertMany(productsData);
    console.log('Products created');

    // 7. Initialize Inventory at Factory
    const inventoryData = products.map(p => ({
      productId: p._id,
      locationId: factory._id,
      companyId: company._id,
      totalStock: 1000,
      reservedStock: 0,
      availableStock: 1000
    }));
    await Inventory.insertMany(inventoryData);
    console.log('Inventory initialized');

    // 8. Create a Coupon
    await Coupon.create({
        code: 'WELCOME20',
        companyId: company._id,
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 100,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    console.log('Coupons created');

    console.log('--- SEEDING COMPLETE ---');
    console.log('Logins:');
    console.log('Admin: admin@example.com / password123');
    console.log('Factory: factory@example.com / password123');
    console.log('Dealer: dealer@example.com / password123');
    console.log('Buyer: buyer@example.com / password123');

    process.exit();
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();