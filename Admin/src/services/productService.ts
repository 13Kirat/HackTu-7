import type { Product, Coupon } from "@/types";
import { products, coupons } from "@/mock/data";

const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const productService = {
  getAll: (): Promise<Product[]> => delay(products),
  getById: (id: string): Promise<Product | undefined> =>
    delay(products.find((p) => p.id === id)),
  create: (product: Omit<Product, "id">): Promise<Product> =>
    delay({ ...product, id: `p${Date.now()}` }),
  update: (id: string, data: Partial<Product>): Promise<Product> => {
    const p = products.find((p) => p.id === id)!;
    return delay({ ...p, ...data });
  },

  getCoupons: (): Promise<Coupon[]> => delay(coupons),
  createCoupon: (coupon: Omit<Coupon, "id">): Promise<Coupon> =>
    delay({ ...coupon, id: `c${Date.now()}` }),
  updateCoupon: (id: string, data: Partial<Coupon>): Promise<Coupon> => {
    const c = coupons.find((c) => c.id === id)!;
    return delay({ ...c, ...data });
  },
};
