import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Tag, Percent, DollarSign } from "lucide-react";
import { couponService } from "@/services/couponService";
import type { Coupon } from "@/types";

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    couponService.getCoupons().then(setCoupons);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Coupons & Schemes</h1>
        <p className="text-muted-foreground">View available discounts and promotional offers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(coupon => (
          <Card key={coupon.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-mono">{coupon.code}</CardTitle>
                    <StatusBadge status={coupon.status} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {coupon.discountType === "percentage" ? (
                  <Badge className="bg-primary/10 text-primary border-0 gap-1">
                    <Percent className="h-3 w-3" /> {coupon.value}% OFF
                  </Badge>
                ) : (
                  <Badge className="bg-success/10 text-success border-0 gap-1">
                    <DollarSign className="h-3 w-3" /> ${coupon.value} OFF
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Valid: {coupon.validFrom} — {coupon.validTo}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Applicable to:</p>
                <div className="flex flex-wrap gap-1">
                  {coupon.applicableProducts.map(p => (
                    <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Coupons;
