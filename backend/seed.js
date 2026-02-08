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
      },
      { 
        name: 'Retailer', 
        permissions: ['create_order', 'view_products'], 
        companyId: company._id 
      },
      { 
        name: 'Contractor', 
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
    const retailerRole = roles.find(r => r.name === 'Retailer');
    const contractorRole = roles.find(r => r.name === 'Contractor');

    // 4. Create Locations
    const factory = await Location.create({
      name: 'Main Manufacturing Plant',
      type: 'factory',
      address: 'Industrial Zone East, SF',
      companyId: company._id,
      coordinates: { lat: 37.7749, lng: -122.4194 }
    });

    const warehouse = await Location.create({
      name: 'Regional Distribution Hub',
      type: 'warehouse',
      address: 'Logistics Park South, SF',
      companyId: company._id,
      coordinates: { lat: 37.7833, lng: -122.4167 }
    });

    const dealerLoc1 = await Location.create({
      name: 'Elite Electronics Retail - North',
      type: 'dealer',
      address: 'Downtown Shopping Center, SF',
      companyId: company._id,
      coordinates: { lat: 37.7949, lng: -122.4094 }
    });

    const dealerLoc2 = await Location.create({
        name: 'Elite Electronics Retail - South',
        type: 'dealer',
        address: 'Bayview District, SF',
        companyId: company._id,
        coordinates: { lat: 37.7349, lng: -122.3894 }
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
        locationId: dealerLoc1._id
      },
      {
        name: 'Alice Buyer',
        email: 'buyer@example.com',
        password: 'password123',
        role: buyerRole._id,
        companyId: company._id,
        address: 'Sunset District, SF',
        coordinates: { lat: 37.7549, lng: -122.4794 } // Closer to dealerLoc1? Let's check.
      },
      {
        name: 'Bob Retailer',
        email: 'retailer@example.com',
        password: 'password123',
        role: retailerRole._id,
        companyId: company._id,
        address: 'Mission District, SF',
        coordinates: { lat: 37.7599, lng: -122.4148 }
      }
    ];

    // Note: User model has pre-save hook for password hashing
    for (const u of usersData) {
        await User.create(u);
    }
    console.log('Users created');

    // 6. Create Products
    const productsData = [
      { 
        name: 'Ultra HD Monitor 32"', 
        sku: 'MON-32-UHD', 
        price: 499, 
        costPrice: 250, 
        companyId: company._id, 
        category: 'Hardware',
        schemes: ['Buy 5 Get 1 Free', '10% Dealer Margin']
      },
      { 
        name: 'Mechanical Keyboard RGB', 
        sku: 'KB-RGB-MECH', 
        price: 129, 
        costPrice: 60, 
        companyId: company._id, 
        category: 'Accessories',
        schemes: ['Bundle with Mouse for 5% off']
      },
      { 
        name: 'Wireless Pro Mouse', 
        sku: 'MSE-WRLS-PRO', 
        price: 89, 
        costPrice: 40, 
        companyId: company._id, 
        category: 'Accessories',
        schemes: ['Bulk Discount 10+ units']
      }
    ];
    const products = await Product.insertMany(productsData);
    console.log('Products created');

    // 7. Initialize Inventory
    const warehouseInventory = products.map(p => ({
      productId: p._id,
      locationId: warehouse._id,
      companyId: company._id,
      totalStock: 200,
      reservedStock: 0,
      availableStock: 200,
      reorderLevel: 50
    }));

    const dealerInventory1 = products.map(p => ({
      productId: p._id,
      locationId: dealerLoc1._id,
      companyId: company._id,
      totalStock: 50,
      reservedStock: 0,
      availableStock: 50,
      reorderLevel: 20
    }));

    const dealerInventory2 = products.map(p => ({
        productId: p._id,
        locationId: dealerLoc2._id,
        companyId: company._id,
        totalStock: 75,
        reservedStock: 0,
        availableStock: 75,
        reorderLevel: 25
    }));

    const factoryInventory = products.map(p => ({
        productId: p._id,
        locationId: factory._id,
        companyId: company._id,
        totalStock: 1000,
        reservedStock: 0,
        availableStock: 1000,
        reorderLevel: 100
    }));

    await Inventory.insertMany([...factoryInventory, ...warehouseInventory, ...dealerInventory1, ...dealerInventory2]);
    console.log('Inventory initialized across factory, warehouse, and dealers');

    // 8. Create Sample Orders for analytics (last 30 days)
    const Order = require('./src/models/Order');
    const ordersData = [];
    const now = new Date();

    for (let i = 0; i < 20; i++) {
        const orderDate = new Date();
        orderDate.setDate(now.getDate() - Math.floor(Math.random() * 30));
        
        ordersData.push({
            orderNumber: `SEED-ORD-${i}`,
            companyId: company._id,
            orderType: 'customer_order',
            customerId: buyerRole._id, 
            fromLocationId: dealerLoc1._id,
            items: [{
                productId: products[i % 3]._id,
                quantity: Math.floor(Math.random() * 10) + 1,
                priceAtTime: products[i % 3].price
            }],
            totalAmount: products[i % 3].price * 5,
            status: 'delivered',
            createdAt: orderDate
        });
    }
    await Order.insertMany(ordersData);
    console.log('Sample delivered orders created for analytics');

    // 9. Create a Coupon
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