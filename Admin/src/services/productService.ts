import api from "@/lib/api";
import type { Product, Coupon } from "@/types";

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get("/products");
    return response.data.map((p: any) => ({
      id: p._id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      basePrice: p.price,
      costPrice: p.costPrice
    }));
  },
  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    const p = response.data;
    return {
      id: p._id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      basePrice: p.price,
      costPrice: p.costPrice
    };
  },
  create: async (product: any): Promise<Product> => {
    const response = await api.post("/products", product);
    return response.data;
  },
  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  getCoupons: async (): Promise<Coupon[]> => {
    const response = await api.get("/coupons");
    return response.data.map((c: any) => ({
      id: c._id,
      code: c.code,
      discountType: c.discountType,
      value: c.discountValue,
      validTo: c.validUntil,
      active: c.isActive
    }));
  },
  createCoupon: async (coupon: any): Promise<Coupon> => {
    const response = await api.post("/coupons", coupon);
    return response.data;
  },
};
