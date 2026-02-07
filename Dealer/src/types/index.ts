export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  stock: number;
  warehouse: string;
  schemes: string[];
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  reorderLevel: number;
}

export interface OrderProduct {
  productName: string;
  quantity: number;
  price: number;
}

export interface TimelineEvent {
  status: string;
  date: string;
  location?: string;
}

export interface Order {
  id: string;
  type: "fulfillment" | "dealer";
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  dealerName: string;
  targetDealer?: string;
  products: OrderProduct[];
  totalAmount: number;
  date: string;
  estimatedDelivery?: string;
  warehouse?: string;
  commission?: number;
  timeline?: TimelineEvent[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  value: number;
  validFrom: string;
  validTo: string;
  applicableProducts: string[];
  status: "active" | "expired" | "upcoming";
}

export interface Alert {
  id: string;
  type: "low_stock" | "high_demand";
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  recommendedAction: string;
  status: "active" | "resolved";
  createdAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
  date: string;
}

export interface Dealer {
  id: string;
  name: string;
  email: string;
  location: string;
  phone: string;
}

export type NotificationType = "order" | "stock" | "alert" | "system" | "promotion";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  meta?: Record<string, string | number>;
}
