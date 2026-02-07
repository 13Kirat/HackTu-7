import type { Product, InventoryItem, Order, Coupon, Alert, Sale, Dealer } from "@/types";

export const products: Product[] = [
  { id: "P001", name: "Industrial Pump X200", sku: "IPX-200", price: 2450, category: "Machinery", stock: 145, warehouse: "Warehouse A", schemes: ["BULK10"] },
  { id: "P002", name: "Hydraulic Valve HV50", sku: "HV-050", price: 380, category: "Components", stock: 320, warehouse: "Warehouse B", schemes: [] },
  { id: "P003", name: "Electric Motor EM1000", sku: "EM-1000", price: 1850, category: "Machinery", stock: 78, warehouse: "Warehouse A", schemes: ["SEASON20"] },
  { id: "P004", name: "Pressure Gauge PG30", sku: "PG-030", price: 120, category: "Instruments", stock: 500, warehouse: "Warehouse C", schemes: [] },
  { id: "P005", name: "Steel Pipe SP500", sku: "SP-500", price: 95, category: "Raw Materials", stock: 1200, warehouse: "Warehouse B", schemes: ["BULK10"] },
  { id: "P006", name: "Control Panel CP80", sku: "CP-080", price: 3200, category: "Electronics", stock: 42, warehouse: "Warehouse A", schemes: ["SEASON20", "NEWDEAL"] },
  { id: "P007", name: "Safety Valve SV15", sku: "SV-015", price: 210, category: "Components", stock: 18, warehouse: "Warehouse C", schemes: [] },
  { id: "P008", name: "Conveyor Belt CB2M", sku: "CB-2M0", price: 4500, category: "Machinery", stock: 25, warehouse: "Warehouse A", schemes: [] },
  { id: "P009", name: "Thermal Sensor TS40", sku: "TS-040", price: 175, category: "Instruments", stock: 280, warehouse: "Warehouse B", schemes: ["NEWDEAL"] },
  { id: "P010", name: "Rubber Gasket RG10", sku: "RG-010", price: 15, category: "Raw Materials", stock: 5000, warehouse: "Warehouse C", schemes: ["BULK10"] },
];

export const inventory: InventoryItem[] = [
  { id: "I001", productId: "P001", productName: "Industrial Pump X200", sku: "IPX-200", totalStock: 145, reservedStock: 30, availableStock: 115, reorderLevel: 50 },
  { id: "I002", productId: "P002", productName: "Hydraulic Valve HV50", sku: "HV-050", totalStock: 320, reservedStock: 45, availableStock: 275, reorderLevel: 100 },
  { id: "I003", productId: "P003", productName: "Electric Motor EM1000", sku: "EM-1000", totalStock: 78, reservedStock: 20, availableStock: 58, reorderLevel: 30 },
  { id: "I004", productId: "P004", productName: "Pressure Gauge PG30", sku: "PG-030", totalStock: 500, reservedStock: 60, availableStock: 440, reorderLevel: 150 },
  { id: "I005", productId: "P005", productName: "Steel Pipe SP500", sku: "SP-500", totalStock: 1200, reservedStock: 200, availableStock: 1000, reorderLevel: 300 },
  { id: "I006", productId: "P006", productName: "Control Panel CP80", sku: "CP-080", totalStock: 42, reservedStock: 15, availableStock: 27, reorderLevel: 20 },
  { id: "I007", productId: "P007", productName: "Safety Valve SV15", sku: "SV-015", totalStock: 18, reservedStock: 5, availableStock: 13, reorderLevel: 25 },
  { id: "I008", productId: "P008", productName: "Conveyor Belt CB2M", sku: "CB-2M0", totalStock: 25, reservedStock: 8, availableStock: 17, reorderLevel: 10 },
  { id: "I009", productId: "P009", productName: "Thermal Sensor TS40", sku: "TS-040", totalStock: 280, reservedStock: 40, availableStock: 240, reorderLevel: 80 },
  { id: "I010", productId: "P010", productName: "Rubber Gasket RG10", sku: "RG-010", totalStock: 5000, reservedStock: 500, availableStock: 4500, reorderLevel: 1000 },
];

export const orders: Order[] = [
  {
    id: "ORD-001", type: "fulfillment", status: "delivered", dealerName: "Metro Dealers",
    products: [{ productName: "Industrial Pump X200", quantity: 5, price: 2450 }],
    totalAmount: 12250, date: "2026-01-15", warehouse: "Warehouse A",
    timeline: [
      { status: "Order Placed", date: "2026-01-15" },
      { status: "Confirmed", date: "2026-01-16" },
      { status: "Shipped", date: "2026-01-18", location: "Distribution Center" },
      { status: "Delivered", date: "2026-01-22", location: "Metro Dealers" },
    ],
  },
  {
    id: "ORD-002", type: "fulfillment", status: "shipped", dealerName: "Metro Dealers",
    products: [{ productName: "Control Panel CP80", quantity: 3, price: 3200 }, { productName: "Thermal Sensor TS40", quantity: 10, price: 175 }],
    totalAmount: 11350, date: "2026-01-28", estimatedDelivery: "2026-02-05", warehouse: "Warehouse A",
    timeline: [
      { status: "Order Placed", date: "2026-01-28" },
      { status: "Confirmed", date: "2026-01-29" },
      { status: "Shipped", date: "2026-02-01", location: "In Transit — Highway 45" },
    ],
  },
  {
    id: "ORD-003", type: "fulfillment", status: "confirmed", dealerName: "Metro Dealers",
    products: [{ productName: "Hydraulic Valve HV50", quantity: 20, price: 380 }],
    totalAmount: 7600, date: "2026-02-03", warehouse: "Warehouse B",
    timeline: [
      { status: "Order Placed", date: "2026-02-03" },
      { status: "Confirmed", date: "2026-02-04" },
    ],
  },
  {
    id: "ORD-004", type: "fulfillment", status: "pending", dealerName: "Metro Dealers",
    products: [{ productName: "Electric Motor EM1000", quantity: 2, price: 1850 }],
    totalAmount: 3700, date: "2026-02-06", warehouse: "Warehouse A",
    timeline: [{ status: "Order Placed", date: "2026-02-06" }],
  },
  {
    id: "ORD-005", type: "dealer", status: "delivered", dealerName: "Metro Dealers", targetDealer: "Alpha Distributors",
    products: [{ productName: "Pressure Gauge PG30", quantity: 50, price: 120 }],
    totalAmount: 6000, date: "2026-01-10", commission: 180,
    timeline: [
      { status: "Order Placed", date: "2026-01-10" },
      { status: "Confirmed", date: "2026-01-11" },
      { status: "Shipped", date: "2026-01-13" },
      { status: "Delivered", date: "2026-01-16" },
    ],
  },
  {
    id: "ORD-006", type: "dealer", status: "shipped", dealerName: "Beta Supplies", targetDealer: "Metro Dealers",
    products: [{ productName: "Safety Valve SV15", quantity: 15, price: 210 }],
    totalAmount: 3150, date: "2026-01-25", commission: 94.5,
    timeline: [
      { status: "Order Placed", date: "2026-01-25" },
      { status: "Confirmed", date: "2026-01-26" },
      { status: "Shipped", date: "2026-01-28", location: "In Transit" },
    ],
  },
  {
    id: "ORD-007", type: "dealer", status: "pending", dealerName: "Metro Dealers", targetDealer: "Gamma Trading",
    products: [{ productName: "Rubber Gasket RG10", quantity: 500, price: 15 }],
    totalAmount: 7500, date: "2026-02-05", commission: 225,
    timeline: [{ status: "Order Placed", date: "2026-02-05" }],
  },
];

export const coupons: Coupon[] = [
  { id: "C001", code: "BULK10", discountType: "percentage", value: 10, validFrom: "2026-01-01", validTo: "2026-03-31", applicableProducts: ["Industrial Pump X200", "Steel Pipe SP500", "Rubber Gasket RG10"], status: "active" },
  { id: "C002", code: "SEASON20", discountType: "percentage", value: 20, validFrom: "2026-02-01", validTo: "2026-02-28", applicableProducts: ["Electric Motor EM1000", "Control Panel CP80"], status: "active" },
  { id: "C003", code: "NEWDEAL", discountType: "fixed", value: 500, validFrom: "2026-01-15", validTo: "2026-04-15", applicableProducts: ["Control Panel CP80", "Thermal Sensor TS40"], status: "active" },
  { id: "C004", code: "FLAT200", discountType: "fixed", value: 200, validFrom: "2025-11-01", validTo: "2025-12-31", applicableProducts: ["Conveyor Belt CB2M"], status: "expired" },
  { id: "C005", code: "SPRING25", discountType: "percentage", value: 25, validFrom: "2026-03-01", validTo: "2026-05-31", applicableProducts: ["All Products"], status: "upcoming" },
];

export const alerts: Alert[] = [
  { id: "A001", type: "low_stock", productId: "P007", productName: "Safety Valve SV15", currentStock: 18, threshold: 25, recommendedAction: "Place reorder for 50 units from Warehouse C", status: "active", createdAt: "2026-02-05" },
  { id: "A002", type: "high_demand", productId: "P001", productName: "Industrial Pump X200", currentStock: 145, threshold: 200, recommendedAction: "Increase stock levels — demand forecasted to rise 35%", status: "active", createdAt: "2026-02-04" },
  { id: "A003", type: "low_stock", productId: "P006", productName: "Control Panel CP80", currentStock: 42, threshold: 50, recommendedAction: "Reorder 30 units from Warehouse A", status: "active", createdAt: "2026-02-03" },
  { id: "A004", type: "high_demand", productId: "P009", productName: "Thermal Sensor TS40", currentStock: 280, threshold: 300, recommendedAction: "Pre-order additional 100 units", status: "active", createdAt: "2026-02-02" },
  { id: "A005", type: "low_stock", productId: "P008", productName: "Conveyor Belt CB2M", currentStock: 25, threshold: 30, recommendedAction: "Urgent: reorder 20 units", status: "resolved", createdAt: "2026-01-28" },
];

export const sales: Sale[] = [
  { id: "S001", productId: "P001", productName: "Industrial Pump X200", quantitySold: 12, revenue: 29400, date: "2026-02-06" },
  { id: "S002", productId: "P002", productName: "Hydraulic Valve HV50", quantitySold: 45, revenue: 17100, date: "2026-02-06" },
  { id: "S003", productId: "P003", productName: "Electric Motor EM1000", quantitySold: 8, revenue: 14800, date: "2026-02-05" },
  { id: "S004", productId: "P004", productName: "Pressure Gauge PG30", quantitySold: 90, revenue: 10800, date: "2026-02-05" },
  { id: "S005", productId: "P005", productName: "Steel Pipe SP500", quantitySold: 200, revenue: 19000, date: "2026-02-04" },
  { id: "S006", productId: "P006", productName: "Control Panel CP80", quantitySold: 5, revenue: 16000, date: "2026-02-04" },
  { id: "S007", productId: "P009", productName: "Thermal Sensor TS40", quantitySold: 35, revenue: 6125, date: "2026-02-03" },
  { id: "S008", productId: "P010", productName: "Rubber Gasket RG10", quantitySold: 800, revenue: 12000, date: "2026-02-03" },
  { id: "S009", productId: "P001", productName: "Industrial Pump X200", quantitySold: 15, revenue: 36750, date: "2026-02-02" },
  { id: "S010", productId: "P007", productName: "Safety Valve SV15", quantitySold: 22, revenue: 4620, date: "2026-02-02" },
  { id: "S011", productId: "P008", productName: "Conveyor Belt CB2M", quantitySold: 3, revenue: 13500, date: "2026-02-01" },
  { id: "S012", productId: "P002", productName: "Hydraulic Valve HV50", quantitySold: 55, revenue: 20900, date: "2026-02-01" },
  { id: "S013", productId: "P004", productName: "Pressure Gauge PG30", quantitySold: 120, revenue: 14400, date: "2026-01-31" },
  { id: "S014", productId: "P005", productName: "Steel Pipe SP500", quantitySold: 300, revenue: 28500, date: "2026-01-31" },
  { id: "S015", productId: "P003", productName: "Electric Motor EM1000", quantitySold: 10, revenue: 18500, date: "2026-01-30" },
];

export const dealers: Dealer[] = [
  { id: "D001", name: "Metro Dealers", email: "contact@metrodealers.com", location: "Mumbai, India", phone: "+91 22 4567 8900" },
  { id: "D002", name: "Alpha Distributors", email: "info@alphadist.com", location: "Delhi, India", phone: "+91 11 2345 6789" },
  { id: "D003", name: "Beta Supplies", email: "hello@betasupplies.com", location: "Bangalore, India", phone: "+91 80 3456 7890" },
  { id: "D004", name: "Gamma Trading", email: "sales@gammatrading.com", location: "Chennai, India", phone: "+91 44 5678 9012" },
  { id: "D005", name: "Delta Equipment", email: "orders@deltaequip.com", location: "Pune, India", phone: "+91 20 6789 0123" },
];
