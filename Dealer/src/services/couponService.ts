import api from "@/lib/api";
import type { Coupon } from "@/types";

export const couponService = {
  getCoupons: async (): Promise<Coupon[]> => {
    const response = await api.get("/coupons");
    return response.data.map((c: any) => {
        const now = new Date();
        const validTo = c.validUntil ? new Date(c.validUntil) : null;
        let status: Coupon["status"] = 'active';
        
        if (!c.isActive) status = 'expired';
        if (validTo && now > validTo) status = 'expired';

        return {
            id: c._id,
            code: c.code,
            discountType: c.discountType,
            value: c.discountValue,
            validFrom: new Date(c.createdAt).toLocaleDateString(),
            validTo: c.validUntil ? new Date(c.validUntil).toLocaleDateString() : "Never",
            applicableProducts: [], // Backend doesn't link products yet
            status
        };
    });
  },
  
  getCouponByCode: async (code: string): Promise<Coupon | undefined> => {
    const coupons = await couponService.getCoupons();
    return coupons.find(c => c.code === code);
  },
};