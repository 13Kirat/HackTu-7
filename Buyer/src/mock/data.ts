import { Product, Dealer, Coupon, Order, Alert, UserProfile, CartItem } from '@/types';

export const mockProducts: Product[] = [
  {
    id: '1', name: 'Premium Oak Panel', sku: 'OAK-PNL-001', price: 249.99,
    category: 'Panels', color: 'Natural Oak', finish: 'Matte', size: '120x60cm',
    description: 'High-quality natural oak panel with a smooth matte finish. Perfect for interior wall cladding and furniture applications.',
    images: ['/placeholder.svg'], availability: 'in_stock', stockCount: 150, estimatedDelivery: '3-5 days',
  },
  {
    id: '2', name: 'Walnut Veneer Sheet', sku: 'WNT-VNR-002', price: 189.50,
    category: 'Veneers', color: 'Dark Walnut', finish: 'Glossy', size: '240x120cm',
    description: 'Premium walnut veneer with a glossy finish. Ideal for high-end cabinetry and decorative surfaces.',
    images: ['/placeholder.svg'], availability: 'in_stock', stockCount: 85, estimatedDelivery: '2-4 days',
  },
  {
    id: '3', name: 'Maple Hardwood Plank', sku: 'MPL-HWD-003', price: 320.00,
    category: 'Planks', color: 'Light Maple', finish: 'Satin', size: '180x20cm',
    description: 'Solid maple hardwood plank with a satin finish. Great for flooring and structural applications.',
    images: ['/placeholder.svg'], availability: 'limited_stock', stockCount: 12, estimatedDelivery: '5-7 days',
  },
  {
    id: '4', name: 'Cherry Wood Trim', sku: 'CHR-TRM-004', price: 45.99,
    category: 'Trims', color: 'Cherry Red', finish: 'Semi-Gloss', size: '240x5cm',
    description: 'Decorative cherry wood trim with semi-gloss finish for elegant edge detailing.',
    images: ['/placeholder.svg'], availability: 'in_stock', stockCount: 300, estimatedDelivery: '1-3 days',
  },
  {
    id: '5', name: 'Bamboo Composite Board', sku: 'BMB-CMP-005', price: 175.00,
    category: 'Panels', color: 'Natural Bamboo', finish: 'Matte', size: '120x60cm',
    description: 'Eco-friendly bamboo composite board. Sustainable choice for modern interior design.',
    images: ['/placeholder.svg'], availability: 'in_stock', stockCount: 200, estimatedDelivery: '2-4 days',
  },
  {
    id: '6', name: 'Teak Decking Tile', sku: 'TEK-DCK-006', price: 89.99,
    category: 'Tiles', color: 'Golden Teak', finish: 'Oil Rubbed', size: '30x30cm',
    description: 'Interlocking teak decking tile with oil-rubbed finish. Perfect for outdoor patios and balconies.',
    images: ['/placeholder.svg'], availability: 'out_of_stock', stockCount: 0, estimatedDelivery: '14-21 days',
  },
  {
    id: '7', name: 'Pine Shiplap Board', sku: 'PIN-SHP-007', price: 55.00,
    category: 'Panels', color: 'White Pine', finish: 'Raw', size: '180x15cm',
    description: 'Classic pine shiplap board for rustic wall coverings and accent walls.',
    images: ['/placeholder.svg'], availability: 'in_stock', stockCount: 500, estimatedDelivery: '1-2 days',
  },
  {
    id: '8', name: 'Ebony Inlay Strip', sku: 'EBN-INL-008', price: 125.00,
    category: 'Trims', color: 'Jet Black', finish: 'High Gloss', size: '100x2cm',
    description: 'Premium ebony inlay strip for luxury furniture and musical instrument detailing.',
    images: ['/placeholder.svg'], availability: 'limited_stock', stockCount: 25, estimatedDelivery: '7-10 days',
  },
];

export const mockDealers: Dealer[] = [
  { id: '1', name: 'WoodCraft Supply Co.', location: 'Mumbai, MH', distance: '5.2 km', stock: 45 },
  { id: '2', name: 'TimberLand Distributors', location: 'Pune, MH', distance: '12.8 km', stock: 120 },
  { id: '3', name: 'GreenWood Depot', location: 'Thane, MH', distance: '8.1 km', stock: 30 },
];

export const mockCoupons: Coupon[] = [
  { id: '1', code: 'SAVE20', description: '20% off on orders above ₹5000', discountType: 'percentage', discountValue: 20, minOrder: 5000, expiresAt: '2026-03-31', active: true },
  { id: '2', code: 'FLAT500', description: 'Flat ₹500 off on all orders', discountType: 'fixed', discountValue: 500, minOrder: 2000, expiresAt: '2026-02-28', active: true },
  { id: '3', code: 'FIRST15', description: '15% off on your first order', discountType: 'percentage', discountValue: 15, minOrder: 1000, expiresAt: '2026-04-30', active: true },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-2026-001', date: '2026-01-15', status: 'delivered', total: 1249.97,
    shippingAddress: '42 Marine Drive, Mumbai, MH 400001',
    items: [
      { productName: 'Premium Oak Panel', quantity: 3, price: 249.99 },
      { productName: 'Cherry Wood Trim', quantity: 5, price: 45.99 },
      { productName: 'Pine Shiplap Board', quantity: 2, price: 55.00 },
    ],
    timeline: [
      { status: 'Order Placed', date: '2026-01-15', description: 'Order confirmed and payment received', completed: true },
      { status: 'Processing', date: '2026-01-16', description: 'Order is being prepared', completed: true },
      { status: 'Shipped', date: '2026-01-17', description: 'Package handed to courier', completed: true },
      { status: 'Delivered', date: '2026-01-20', description: 'Package delivered successfully', completed: true },
    ],
  },
  {
    id: 'ORD-2026-002', date: '2026-02-01', status: 'shipped', total: 699.50,
    shippingAddress: '15 Park Street, Pune, MH 411001',
    items: [
      { productName: 'Walnut Veneer Sheet', quantity: 2, price: 189.50 },
      { productName: 'Maple Hardwood Plank', quantity: 1, price: 320.00 },
    ],
    timeline: [
      { status: 'Order Placed', date: '2026-02-01', description: 'Order confirmed', completed: true },
      { status: 'Processing', date: '2026-02-02', description: 'Preparing your order', completed: true },
      { status: 'Shipped', date: '2026-02-04', description: 'In transit via BlueDart', completed: true },
      { status: 'Delivered', date: '2026-02-08', description: 'Estimated delivery', completed: false },
    ],
  },
  {
    id: 'ORD-2026-003', date: '2026-02-05', status: 'confirmed', total: 350.00,
    shippingAddress: '7 Hill Road, Thane, MH 400601',
    items: [
      { productName: 'Bamboo Composite Board', quantity: 2, price: 175.00 },
    ],
    timeline: [
      { status: 'Order Placed', date: '2026-02-05', description: 'Order confirmed', completed: true },
      { status: 'Processing', date: '2026-02-06', description: 'Preparing your order', completed: true },
      { status: 'Shipped', date: '', description: 'Awaiting shipment', completed: false },
      { status: 'Delivered', date: '', description: 'Pending', completed: false },
    ],
  },
];

export const mockAlerts: Alert[] = [
  { id: '1', type: 'order', title: 'Order Shipped', message: 'Your order ORD-2026-002 has been shipped via BlueDart.', date: '2026-02-04', read: false },
  { id: '2', type: 'promo', title: 'Flash Sale!', message: 'Get 25% off on all veneer products this weekend.', date: '2026-02-03', read: false },
  { id: '3', type: 'delivery', title: 'Delivery Update', message: 'Order ORD-2026-001 was delivered successfully.', date: '2026-01-20', read: true },
  { id: '4', type: 'system', title: 'New Products Added', message: '12 new products have been added to the catalog.', date: '2026-01-18', read: true },
];

export const mockProfile: UserProfile = {
  id: 'USR-001',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@example.com',
  phone: '+91 98765 43210',
  location: 'Mumbai, Maharashtra',
  avatar: '',
  company: 'Kumar Interiors Pvt. Ltd.',
};

export const mockCategories = ['Panels', 'Veneers', 'Planks', 'Trims', 'Tiles'];
export const mockColors = ['Natural Oak', 'Dark Walnut', 'Light Maple', 'Cherry Red', 'Natural Bamboo', 'Golden Teak', 'White Pine', 'Jet Black'];
export const mockFinishes = ['Matte', 'Glossy', 'Satin', 'Semi-Gloss', 'Oil Rubbed', 'Raw', 'High Gloss'];
