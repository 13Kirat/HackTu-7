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
      name: 'Modern Colors',
      contactEmail: 'hello@moderncolors.com',
      address: '101 Chroma Lane, Design District, NY',
      phone: '+1 800-MOD-COLOR'
    });
    console.log('Company created: Modern Colors');

    // 3. Create Roles
    const rolesData = [
      { 
        name: 'Company Admin', 
        permissions: ['admin'], 
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
      }
    ];
    const roles = await Role.insertMany(rolesData);
    console.log('Roles created');

    const adminRole = roles.find(r => r.name === 'Company Admin');
    const factoryRole = roles.find(r => r.name === 'Factory Manager');
    const dealerRole = roles.find(r => r.name === 'Dealer');
    const buyerRole = roles.find(r => r.name === 'Buyer');
    const retailerRole = roles.find(r => r.name === 'Retailer');

    // 4. Create Locations
    const factory = await Location.create({
      name: 'Modern Colors Main Plant',
      type: 'factory',
      address: 'Industrial Parkway, New Jersey',
      companyId: company._id,
      coordinates: { lat: 40.7128, lng: -74.0060 }
    });

    const warehouse = await Location.create({
      name: 'East Coast Distribution Center',
      type: 'warehouse',
      address: 'Logistics Way, Pennsylvania',
      companyId: company._id,
      coordinates: { lat: 39.9526, lng: -75.1652 }
    });

    const dealerLoc1 = await Location.create({
      name: 'Downtown Decor & Paints',
      type: 'dealer',
      address: '5th Ave, Manhattan, NY',
      companyId: company._id,
      coordinates: { lat: 40.7831, lng: -73.9712 }
    });

    const dealerLoc2 = await Location.create({
        name: 'Suburban Color Hub',
        type: 'dealer',
        address: 'Main St, Brooklyn, NY',
        companyId: company._id,
        coordinates: { lat: 40.6782, lng: -73.9442 }
    });
    console.log('Locations created');

    // 5. Create Users
    const usersData = [
      {
        name: 'Modern Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: adminRole._id,
        companyId: company._id
      },
      {
        name: 'Factory Supervisor',
        email: 'factory@example.com',
        password: 'password123',
        role: factoryRole._id,
        companyId: company._id,
        locationId: factory._id
      },
      {
        name: 'Elite Dealer',
        email: 'dealer@example.com',
        password: 'password123',
        role: dealerRole._id,
        companyId: company._id,
        locationId: dealerLoc1._id
      },
      {
        name: 'Alice Homeowner',
        email: 'buyer@example.com',
        password: 'password123',
        role: buyerRole._id,
        companyId: company._id,
        address: 'Upper West Side, NY',
        coordinates: { lat: 40.7870, lng: -73.9754 }
      },
      {
        name: 'Bob Retail Partner',
        email: 'retailer@example.com',
        password: 'password123',
        role: retailerRole._id,
        companyId: company._id,
        address: 'Queens, NY',
        coordinates: { lat: 40.7282, lng: -73.7949 }
      }
    ];

    for (const u of usersData) {
        await User.create(u);
    }
    console.log('Users created');

    // 6. Create Products (Paint Specific)
    const productsData = [
      { 
        name: 'Titanium White - Premium Emulsion', 
        sku: 'MC-PW-001', 
        price: 45, 
        costPrice: 20, 
        companyId: company._id, 
        category: 'Interior Paints',
        schemes: ['Buy 10 Get 1 Gallon Free', 'Early Bird 5% Off'],
        attributes: { finish: 'Silk', color: 'White', size: '5L' }
      },
      { 
        name: 'Midnight Blue - Weather Guard', 
        sku: 'MC-EXT-002', 
        price: 65, 
        costPrice: 30, 
        companyId: company._id, 
        category: 'Exterior Paints',
        schemes: ['Bulk Discount 20+ units'],
        attributes: { finish: 'Matte', color: 'Blue', size: '10L' }
      },
      { 
        name: 'Royal Gold - Metallic Series', 
        sku: 'MC-MET-003', 
        price: 120, 
        costPrice: 55, 
        companyId: company._id, 
        category: 'Specialty',
        schemes: ['Festive Season 10% Off'],
        attributes: { finish: 'Metallic', color: 'Gold', size: '1L' }
      },
      { 
        name: 'Concrete Primer - Super Grip', 
        sku: 'MC-PRM-004', 
        price: 35, 
        costPrice: 15, 
        companyId: company._id, 
        category: 'Primers',
        attributes: { finish: 'Flat', color: 'Grey', size: '5L' }
      }
    ];
    const products = await Product.insertMany(productsData);
    console.log('Paint products created');

    // 7. Initialize Inventory
    const warehouseInventory = products.map(p => ({
      productId: p._id,
      locationId: warehouse._id,
      companyId: company._id,
      totalStock: 500,
      reservedStock: 0,
      availableStock: 500,
      reorderLevel: 100
    }));

    const dealerInventory1 = products.map(p => ({
      productId: p._id,
      locationId: dealerLoc1._id,
      companyId: company._id,
      totalStock: 100,
      reservedStock: 0,
      availableStock: 100,
      reorderLevel: 25
    }));

    const factoryInventory = products.map(p => ({
        productId: p._id,
        locationId: factory._id,
        companyId: company._id,
        totalStock: 5000,
        reservedStock: 0,
        availableStock: 5000,
        reorderLevel: 500
    }));

    await Inventory.insertMany([...factoryInventory, ...warehouseInventory, ...dealerInventory1]);
    console.log('Inventory initialized for Modern Colors network');

    // 8. Create Sample Orders for analytics
    const Order = require('./src/models/Order');
    const ordersData = [];
    const now = new Date();

    for (let i = 0; i < 30; i++) {
        const orderDate = new Date();
        orderDate.setDate(now.getDate() - Math.floor(Math.random() * 60));
        
        ordersData.push({
            orderNumber: `MC-ORD-${i}`,
            companyId: company._id,
            orderType: 'customer_order',
            customerId: buyerRole._id, 
            fromLocationId: dealerLoc1._id,
            items: [{
                productId: products[i % 4]._id,
                quantity: Math.floor(Math.random() * 5) + 1,
                priceAtTime: products[i % 4].price
            }],
            totalAmount: products[i % 4].price * 2,
            status: 'delivered',
            createdAt: orderDate
        });
    }
    await Order.insertMany(ordersData);
    console.log('Sample paint orders created');

    // 9. Create a Coupon
    await Coupon.create({
        code: 'MODERN20',
        companyId: company._id,
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 200,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    });
    console.log('Coupons created');

    process.exit();
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
