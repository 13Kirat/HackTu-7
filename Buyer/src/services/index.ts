import api from '@/lib/api';
import { Product, Dealer, Coupon, Order, Alert, UserProfile } from '@/types';

export const productService = {
  async getProducts(filters?: { category?: string; search?: string; color?: string; finish?: string; priceRange?: [number, number] }): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.color) params.append('color', filters.color);
    if (filters?.finish) params.append('finish', filters.finish);
    if (filters?.priceRange) {
        params.append('minPrice', filters.priceRange[0].toString());
        params.append('maxPrice', filters.priceRange[1].toString());
    }

    const response = await api.get(`/buyer/products?${params.toString()}`);
    return response.data.map((p: any) => ({
        id: p._id,
        name: p.name,
        sku: p.sku,
        price: p.price,
        category: p.category,
        color: p.attributes?.color || 'N/A',
        finish: p.attributes?.finish || 'N/A',
        size: p.attributes?.size || 'N/A',
        description: p.description || '',
        images: [],
        availability: p.availableStock > 0 ? 'in_stock' : 'out_of_stock',
        stockCount: p.availableStock,
        estimatedDelivery: '2-3 Days'
    }));
  },

  async getProduct(id: string): Promise<any> {
    const response = await api.get(`/buyer/products/${id}`);
    const data = response.data;
    return {
        product: {
            id: data.product._id,
            name: data.product.name,
            sku: data.product.sku,
            price: data.product.price,
            category: data.product.category,
            description: data.product.description,
            color: data.product.attributes?.color || 'N/A',
            finish: data.product.attributes?.finish || 'N/A'
        },
        availableStock: data.availableStock,
        dealer: data.dealerLocation,
        coupons: data.activeCoupons
    };
  },

  async getDealers(productId: string): Promise<Dealer[]> {
    const response = await api.get(`/buyer/availability/${productId}`);
    const d = response.data.dealer;
    return [{
        id: d._id,
        name: d.name,
        location: d.address,
        distance: 'Nearest',
        stock: response.data.availableStock
    }];
  },
};

export const couponService = {
  async getCoupons(): Promise<Coupon[]> {
    const response = await api.get('/buyer/coupons');
    return response.data.map((c: any) => ({
        id: c._id,
        code: c.code,
        description: `${c.discountValue}${c.discountType === 'percentage' ? '%' : '₹'} OFF`,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrder: c.minOrderValue,
        expiresAt: c.validUntil,
        active: c.isActive
    }));
  },

  async applyCoupon(code: string, items: any[]): Promise<{ valid: boolean; discountAmount: number; message: string }> {
    try {
        const response = await api.post('/buyer/coupons/validate', { couponCode: code, items });
        return { 
            valid: true, 
            discountAmount: response.data.discountAmount, 
            message: 'Coupon applied successfully!' 
        };
    } catch (error: any) {
        return { 
            valid: false, 
            discountAmount: 0, 
            message: error.response?.data?.message || 'Invalid coupon' 
        };
    }
  },
};

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const response = await api.get('/buyer/orders');
    return response.data.map((o: any) => ({
        id: o._id,
        date: new Date(o.createdAt).toLocaleDateString(),
        status: o.status,
        items: o.items.map((i: any) => ({
            productName: i.productId?.name || 'Product',
            quantity: i.quantity,
            price: i.priceAtTime
        })),
        total: o.totalAmount,
        shippingAddress: 'Your Saved Address',
        timeline: []
    }));
  },

  async getOrder(id: string): Promise<any> {
    const response = await api.get(`/buyer/orders/${id}`);
    return response.data;
  },

  async placeOrder(data: { items: any[]; couponCode?: string }): Promise<{ _id: string; success: boolean }> {
    const response = await api.post('/buyer/orders', data);
    return { ...response.data, success: true };
  },

  async getSummary(): Promise<any> {
      const response = await api.get('/buyer/orders/summary');
      return response.data;
  },

  async getTracking(id: string): Promise<any> {
      const response = await api.get(`/buyer/orders/${id}/tracking`);
      return response.data;
  }
};

export const alertService = {
  async getAlerts(): Promise<Alert[]> {
    const response = await api.get('/buyer/alerts');
    return response.data.map((a: any) => ({
        id: a._id,
        type: 'order',
        title: a.type.toUpperCase(),
        message: a.message,
        date: new Date(a.createdAt).toLocaleDateString(),
        read: a.status === 'resolved'
    }));
  },
  async markAsRead(id: string): Promise<void> {
      await api.put(`/alerts/${id}/resolve`);
  },
};

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/auth/profile');
    const u = response.data;
    return {
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone || '',
        location: u.address || '',
        avatar: '',
        company: u.companyId?.name || 'Consumer'
    };
  },
  async updateProfile(data: any): Promise<UserProfile> {
    const response = await api.put('/auth/profile', data);
    const u = response.data;
    return {
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone || '',
        location: u.address || '',
        avatar: '',
        company: u.companyId?.name || 'Consumer'
    };
  },
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean }> {
    // Backend doesn't have specific endpoint yet, could use /profile if added
    return { success: true };
  },
};