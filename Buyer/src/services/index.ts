import { Product, Dealer, Coupon, Order, Alert, UserProfile } from '@/types';
import { mockProducts, mockDealers, mockCoupons, mockOrders, mockAlerts, mockProfile } from '@/mock/data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getProducts(filters?: { category?: string; search?: string; color?: string; finish?: string; priceRange?: [number, number] }): Promise<Product[]> {
    await delay(300);
    let products = [...mockProducts];
    if (filters?.category) products = products.filter(p => p.category === filters.category);
    if (filters?.color) products = products.filter(p => p.color === filters.color);
    if (filters?.finish) products = products.filter(p => p.finish === filters.finish);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (filters?.priceRange) products = products.filter(p => p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]);
    return products;
  },
  async getProduct(id: string): Promise<Product | undefined> {
    await delay(200);
    return mockProducts.find(p => p.id === id);
  },
  async getDealers(productId: string): Promise<Dealer[]> {
    await delay(200);
    return mockDealers;
  },
};

export const couponService = {
  async getCoupons(): Promise<Coupon[]> { await delay(200); return mockCoupons; },
  async applyCoupon(code: string, total: number): Promise<{ valid: boolean; discount: number; message: string }> {
    await delay(300);
    const coupon = mockCoupons.find(c => c.code === code && c.active);
    if (!coupon) return { valid: false, discount: 0, message: 'Invalid coupon code' };
    if (total < coupon.minOrder) return { valid: false, discount: 0, message: `Minimum order of ₹${coupon.minOrder} required` };
    const discount = coupon.discountType === 'percentage' ? (total * coupon.discountValue) / 100 : coupon.discountValue;
    return { valid: true, discount, message: `Coupon applied! You save ₹${discount.toFixed(2)}` };
  },
};

export const orderService = {
  async getOrders(): Promise<Order[]> { await delay(300); return mockOrders; },
  async getOrder(id: string): Promise<Order | undefined> { await delay(200); return mockOrders.find(o => o.id === id); },
  async placeOrder(data: { items: any[]; address: string; couponCode?: string }): Promise<{ orderId: string; success: boolean }> {
    await delay(500);
    return { orderId: `ORD-2026-${String(mockOrders.length + 1).padStart(3, '0')}`, success: true };
  },
};

export const alertService = {
  async getAlerts(): Promise<Alert[]> { await delay(200); return mockAlerts; },
  async markAsRead(id: string): Promise<void> { await delay(100); },
};

export const profileService = {
  async getProfile(): Promise<UserProfile> { await delay(200); return mockProfile; },
  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> { await delay(300); return { ...mockProfile, ...data }; },
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean }> { await delay(300); return { success: true }; },
};
