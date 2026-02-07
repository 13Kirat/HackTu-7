import type {
  Product, Location, InventoryItem, InventoryMovement, Alert,
  Forecast, ForecastPoint, User, Role, Order, Coupon,
  SalesData, ProductSalesData, StockCategory,
} from "@/types";

// ---- Locations ----
export const locations: Location[] = [
  { id: "l1", name: "Mumbai Factory", type: "factory", region: "West", address: "Andheri East, Mumbai" },
  { id: "l2", name: "Delhi Warehouse", type: "warehouse", region: "North", address: "Okhla Industrial, Delhi" },
  { id: "l3", name: "Chennai Warehouse", type: "warehouse", region: "South", address: "Guindy, Chennai" },
  { id: "l4", name: "Kolkata Dealer", type: "dealer", region: "East", address: "Salt Lake, Kolkata" },
  { id: "l5", name: "Bangalore Dealer", type: "dealer", region: "South", address: "Whitefield, Bangalore" },
  { id: "l6", name: "Pune Factory", type: "factory", region: "West", address: "Hinjewadi, Pune" },
];

// ---- Products ----
export const products: Product[] = [
  { id: "p1", name: "Premium Ceramic Tile", sku: "PCT-001", category: "Tiles", color: "Ivory", finish: "Glossy", size: "60x60cm", basePrice: 45 },
  { id: "p2", name: "Rustic Wood Plank", sku: "RWP-002", category: "Flooring", color: "Walnut", finish: "Matte", size: "120x20cm", basePrice: 62 },
  { id: "p3", name: "Marble Slab Classic", sku: "MSC-003", category: "Slabs", color: "White", finish: "Polished", size: "240x120cm", basePrice: 180 },
  { id: "p4", name: "Granite Counter", sku: "GCT-004", category: "Countertops", color: "Black", finish: "Honed", size: "200x60cm", basePrice: 220 },
  { id: "p5", name: "Porcelain Mosaic", sku: "PMO-005", category: "Tiles", color: "Blue", finish: "Textured", size: "30x30cm", basePrice: 35 },
  { id: "p6", name: "Vinyl Floor Sheet", sku: "VFS-006", category: "Flooring", color: "Grey", finish: "Matte", size: "200x100cm", basePrice: 28 },
  { id: "p7", name: "Quartz Worktop", sku: "QWT-007", category: "Countertops", color: "Beige", finish: "Polished", size: "300x60cm", basePrice: 340 },
  { id: "p8", name: "Terracotta Tile", sku: "TCT-008", category: "Tiles", color: "Terracotta", finish: "Natural", size: "40x40cm", basePrice: 22 },
];

// ---- Inventory ----
export const inventory: InventoryItem[] = [
  { id: "i1", productId: "p1", productName: "Premium Ceramic Tile", sku: "PCT-001", locationId: "l1", locationName: "Mumbai Factory", locationType: "factory", region: "West", totalStock: 5200, reservedStock: 800, availableStock: 4400, reorderLevel: 1000 },
  { id: "i2", productId: "p2", productName: "Rustic Wood Plank", sku: "RWP-002", locationId: "l2", locationName: "Delhi Warehouse", locationType: "warehouse", region: "North", totalStock: 3100, reservedStock: 500, availableStock: 2600, reorderLevel: 800 },
  { id: "i3", productId: "p3", productName: "Marble Slab Classic", sku: "MSC-003", locationId: "l3", locationName: "Chennai Warehouse", locationType: "warehouse", region: "South", totalStock: 420, reservedStock: 120, availableStock: 300, reorderLevel: 100 },
  { id: "i4", productId: "p4", productName: "Granite Counter", sku: "GCT-004", locationId: "l4", locationName: "Kolkata Dealer", locationType: "dealer", region: "East", totalStock: 85, reservedStock: 30, availableStock: 55, reorderLevel: 50 },
  { id: "i5", productId: "p5", productName: "Porcelain Mosaic", sku: "PMO-005", locationId: "l5", locationName: "Bangalore Dealer", locationType: "dealer", region: "South", totalStock: 1800, reservedStock: 400, availableStock: 1400, reorderLevel: 500 },
  { id: "i6", productId: "p1", productName: "Premium Ceramic Tile", sku: "PCT-001", locationId: "l2", locationName: "Delhi Warehouse", locationType: "warehouse", region: "North", totalStock: 2200, reservedStock: 300, availableStock: 1900, reorderLevel: 600 },
  { id: "i7", productId: "p6", productName: "Vinyl Floor Sheet", sku: "VFS-006", locationId: "l6", locationName: "Pune Factory", locationType: "factory", region: "West", totalStock: 6800, reservedStock: 200, availableStock: 6600, reorderLevel: 1500 },
  { id: "i8", productId: "p7", productName: "Quartz Worktop", sku: "QWT-007", locationId: "l1", locationName: "Mumbai Factory", locationType: "factory", region: "West", totalStock: 150, reservedStock: 50, availableStock: 100, reorderLevel: 40 },
  { id: "i9", productId: "p8", productName: "Terracotta Tile", sku: "TCT-008", locationId: "l3", locationName: "Chennai Warehouse", locationType: "warehouse", region: "South", totalStock: 4300, reservedStock: 600, availableStock: 3700, reorderLevel: 900 },
  { id: "i10", productId: "p3", productName: "Marble Slab Classic", sku: "MSC-003", locationId: "l5", locationName: "Bangalore Dealer", locationType: "dealer", region: "South", totalStock: 60, reservedStock: 45, availableStock: 15, reorderLevel: 30 },
];

// ---- Movements ----
export const movements: InventoryMovement[] = [
  { id: "m1", date: "2026-02-06", productId: "p1", productName: "Premium Ceramic Tile", fromLocationId: "l1", fromLocationName: "Mumbai Factory", toLocationId: "l2", toLocationName: "Delhi Warehouse", quantity: 500, movementType: "transfer" },
  { id: "m2", date: "2026-02-05", productId: "p3", productName: "Marble Slab Classic", fromLocationId: "l3", fromLocationName: "Chennai Warehouse", toLocationId: "l5", toLocationName: "Bangalore Dealer", quantity: 30, movementType: "shipment" },
  { id: "m3", date: "2026-02-04", productId: "p5", productName: "Porcelain Mosaic", fromLocationId: "l1", fromLocationName: "Mumbai Factory", toLocationId: "l5", toLocationName: "Bangalore Dealer", quantity: 200, movementType: "transfer" },
  { id: "m4", date: "2026-02-03", productId: "p2", productName: "Rustic Wood Plank", fromLocationId: "l6", fromLocationName: "Pune Factory", toLocationId: "l2", toLocationName: "Delhi Warehouse", quantity: 800, movementType: "restock" },
  { id: "m5", date: "2026-02-02", productId: "p4", productName: "Granite Counter", fromLocationId: "l4", fromLocationName: "Kolkata Dealer", toLocationId: "l2", toLocationName: "Delhi Warehouse", quantity: 10, movementType: "return" },
  { id: "m6", date: "2026-02-01", productId: "p7", productName: "Quartz Worktop", fromLocationId: "l1", fromLocationName: "Mumbai Factory", toLocationId: "l3", toLocationName: "Chennai Warehouse", quantity: 25, movementType: "transfer" },
];

// ---- Alerts ----
export const alerts: Alert[] = [
  { id: "a1", type: "low_stock", message: "Stock below reorder level", productName: "Granite Counter", locationName: "Kolkata Dealer", timestamp: "2026-02-07T08:30:00Z" },
  { id: "a2", type: "overstock", message: "Stock exceeds capacity threshold", productName: "Vinyl Floor Sheet", locationName: "Pune Factory", timestamp: "2026-02-07T07:15:00Z" },
  { id: "a3", type: "high_demand", message: "Demand surge detected", productName: "Premium Ceramic Tile", locationName: "Delhi Warehouse", timestamp: "2026-02-06T22:00:00Z" },
  { id: "a4", type: "low_stock", message: "Critical stock level", productName: "Marble Slab Classic", locationName: "Bangalore Dealer", timestamp: "2026-02-06T18:45:00Z" },
];

// ---- Forecasts ----
export const forecasts: Forecast[] = [
  { id: "f1", productId: "p1", productName: "Premium Ceramic Tile", locationId: "l2", locationName: "Delhi Warehouse", currentStock: 2200, predictedDemand: 3500, recommendedReplenishment: 1800 },
  { id: "f2", productId: "p3", productName: "Marble Slab Classic", locationId: "l5", locationName: "Bangalore Dealer", currentStock: 60, predictedDemand: 120, recommendedReplenishment: 80 },
  { id: "f3", productId: "p4", productName: "Granite Counter", locationId: "l4", locationName: "Kolkata Dealer", currentStock: 85, predictedDemand: 150, recommendedReplenishment: 100 },
  { id: "f4", productId: "p5", productName: "Porcelain Mosaic", locationId: "l5", locationName: "Bangalore Dealer", currentStock: 1800, predictedDemand: 2200, recommendedReplenishment: 600 },
  { id: "f5", productId: "p8", productName: "Terracotta Tile", locationId: "l3", locationName: "Chennai Warehouse", currentStock: 4300, predictedDemand: 3000, recommendedReplenishment: 0 },
];

export const forecastTimeline: ForecastPoint[] = [
  { month: "Sep", historical: 2400, predicted: 0 },
  { month: "Oct", historical: 2800, predicted: 0 },
  { month: "Nov", historical: 3200, predicted: 0 },
  { month: "Dec", historical: 3800, predicted: 0 },
  { month: "Jan", historical: 3100, predicted: 3100 },
  { month: "Feb", historical: 0, predicted: 3500 },
  { month: "Mar", historical: 0, predicted: 3900 },
  { month: "Apr", historical: 0, predicted: 4200 },
];

// ---- Users ----
export const users: User[] = [
  { id: "u1", name: "Arjun Mehta", email: "arjun@supplyco.com", role: "admin", location: "Mumbai Factory", status: "active" },
  { id: "u2", name: "Priya Sharma", email: "priya@supplyco.com", role: "manager", location: "Delhi Warehouse", status: "active" },
  { id: "u3", name: "Ravi Kumar", email: "ravi@supplyco.com", role: "operator", location: "Chennai Warehouse", status: "active" },
  { id: "u4", name: "Sneha Patel", email: "sneha@supplyco.com", role: "viewer", location: "Kolkata Dealer", status: "inactive" },
  { id: "u5", name: "Vikram Singh", email: "vikram@supplyco.com", role: "manager", location: "Bangalore Dealer", status: "active" },
];

// ---- Roles ----
export const roles: Role[] = [
  { id: "r1", name: "Admin", description: "Full system access", permissions: { inventory: { read: true, create: true, update: true, delete: true }, orders: { read: true, create: true, update: true, delete: true }, users: { read: true, create: true, update: true, delete: true }, products: { read: true, create: true, update: true, delete: true } } },
  { id: "r2", name: "Manager", description: "Manage inventory and orders", permissions: { inventory: { read: true, create: true, update: true, delete: false }, orders: { read: true, create: true, update: true, delete: false }, users: { read: true, create: false, update: false, delete: false }, products: { read: true, create: true, update: true, delete: false } } },
  { id: "r3", name: "Operator", description: "Day-to-day operations", permissions: { inventory: { read: true, create: true, update: true, delete: false }, orders: { read: true, create: true, update: false, delete: false }, users: { read: false, create: false, update: false, delete: false }, products: { read: true, create: false, update: false, delete: false } } },
  { id: "r4", name: "Viewer", description: "Read-only access", permissions: { inventory: { read: true, create: false, update: false, delete: false }, orders: { read: true, create: false, update: false, delete: false }, users: { read: false, create: false, update: false, delete: false }, products: { read: true, create: false, update: false, delete: false } } },
];

// ---- Orders ----
export const orders: Order[] = [
  { id: "o1", productId: "p1", productName: "Premium Ceramic Tile", quantity: 200, status: "delivered", date: "2026-01-28", region: "North" },
  { id: "o2", productId: "p3", productName: "Marble Slab Classic", quantity: 15, status: "shipped", date: "2026-02-02", region: "South" },
  { id: "o3", productId: "p5", productName: "Porcelain Mosaic", quantity: 350, status: "processing", date: "2026-02-05", region: "South" },
  { id: "o4", productId: "p2", productName: "Rustic Wood Plank", quantity: 100, status: "pending", date: "2026-02-07", region: "North" },
  { id: "o5", productId: "p7", productName: "Quartz Worktop", quantity: 8, status: "processing", date: "2026-02-06", region: "West" },
];

// ---- Coupons ----
export const coupons: Coupon[] = [
  { id: "c1", code: "TILE20", discountType: "percentage", value: 20, validFrom: "2026-02-01", validTo: "2026-03-31", applicableProducts: ["p1", "p5", "p8"], active: true },
  { id: "c2", code: "FLAT500", discountType: "fixed", value: 500, validFrom: "2026-01-15", validTo: "2026-02-28", applicableProducts: ["p3", "p4", "p7"], active: true },
  { id: "c3", code: "FLOOR10", discountType: "percentage", value: 10, validFrom: "2026-01-01", validTo: "2026-01-31", applicableProducts: ["p2", "p6"], active: false },
];

// ---- Analytics ----
export const salesByRegion: SalesData[] = [
  { region: "North", sales: 124000 },
  { region: "South", sales: 98000 },
  { region: "East", sales: 67000 },
  { region: "West", sales: 156000 },
];

export const salesByProduct: ProductSalesData[] = [
  { product: "Ceramic Tile", sales: 89000 },
  { product: "Wood Plank", sales: 67000 },
  { product: "Marble Slab", sales: 112000 },
  { product: "Granite", sales: 54000 },
  { product: "Mosaic", sales: 43000 },
  { product: "Vinyl", sales: 31000 },
];

// ---- Stock Categories ----
export const fastMoving: StockCategory[] = [
  { product: "Premium Ceramic Tile", sku: "PCT-001", totalStock: 7400, monthlySales: 3200, turnoverRate: 5.2 },
  { product: "Porcelain Mosaic", sku: "PMO-005", totalStock: 1800, monthlySales: 900, turnoverRate: 6.0 },
];

export const slowMoving: StockCategory[] = [
  { product: "Quartz Worktop", sku: "QWT-007", totalStock: 150, monthlySales: 12, turnoverRate: 0.96 },
  { product: "Granite Counter", sku: "GCT-004", totalStock: 85, monthlySales: 18, turnoverRate: 2.5 },
];

export const deadStock: StockCategory[] = [
  { product: "Vinyl Floor Sheet", sku: "VFS-006", totalStock: 6800, monthlySales: 5, turnoverRate: 0.09 },
];

export const stockDistribution = [
  { name: "Factories", value: 12150 },
  { name: "Warehouses", value: 10020 },
  { name: "Dealers", value: 1945 },
];
