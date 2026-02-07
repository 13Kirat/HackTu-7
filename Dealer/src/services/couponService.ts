import { coupons } from "@/mock/data";
import type { Coupon } from "@/types";

export const couponService = {
  getCoupons: (): Promise<Coupon[]> => Promise.resolve(coupons),
  getCouponByCode: (code: string): Promise<Coupon | undefined> => Promise.resolve(coupons.find(c => c.code === code)),
};
