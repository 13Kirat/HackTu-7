export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  color: string;
  finish: string;
  size: string;
  description: string;
  images: string[];
  availability: 'in_stock' | 'limited_stock' | 'out_of_stock';
  stockCount: number;
  estimatedDelivery: string;
}

export interface Dealer {
  id: string;
  name: string;
  location: string;
  distance: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  expiresAt: string;
  active: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: { productName: string; quantity: number; price: number }[];
  total: number;
  shippingAddress: string;
  timeline: OrderEvent[];
}

export interface OrderEvent {
  status: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface Alert {
  id: string;
  type: 'order' | 'delivery' | 'promo' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  company: string;
  companyId?: string;
}
