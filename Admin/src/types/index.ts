// ---- Core Entities ----

export interface Company {
  id: string;
  name: string;
  industry: string;
}

export type LocationType = "factory" | "warehouse" | "dealer";

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  address: string;
  managerId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  color: string;
  finish: string;
  size: string;
  basePrice: number;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  locationId: string;
  locationName: string;
  locationType: LocationType;
  region: string;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  reorderLevel: number;
}

export type MovementType = "transfer" | "shipment" | "return" | "restock";

export interface InventoryMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  fromLocationId?: string;
  fromLocationName: string;
  toLocationId?: string;
  toLocationName: string;
  quantity: number;
  movementType: string;
}

export type AlertType = "low_stock" | "overstock" | "high_demand";

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  productName: string;
  locationName: string;
  timestamp: string;
}

export interface Forecast {
  id: string;
  productId: string;
  productName: string;
  locationId: string;
  locationName: string;
  currentStock?: number;
  predictedDemand: number;
  forecastDate: string;
}

export interface ForecastPoint {
  month: string;
  historical: number;
  predicted: number;
}

export type UserRole = "Company Admin" | "Super Admin" | "Factory Manager" | "Dealer" | "Buyer" | "admin" | "manager" | "viewer" | "operator";
export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  companyId?: string;
  status?: UserStatus;
  avatar?: string;
  token?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, Permission>;
}

export interface Permission {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  date: string;
  region: string;
}

export type DiscountType = "percentage" | "fixed";

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  value: number;
  validFrom: string;
  validTo: string;
  applicableProducts: string[];
  active: boolean;
}

export interface SalesData {
  region: string;
  sales: number;
}

export interface ProductSalesData {
  product: string;
  sales: number;
}

export interface StockCategory {
  product: string;
  sku: string;
  totalStock: number;
  monthlySales: number;
  turnoverRate: number;
}
