import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Tag, Percent, DollarSign, Loader2 } from "lucide-react";
import { couponService } from "@/services/couponService";
import type { Coupon } from "@/types";

const Coupons = () => {
  const { data: coupons, isLoading } = useQuery({
    queryKey: ["dealer-coupons"],
    queryFn: couponService.getCoupons,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Coupons & Schemes</h1>
        <p className="text-muted-foreground">Available discounts and seasonal promotional offers</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : !coupons || coupons.length === 0 ? (
        <Card className="shadow-sm border-dashed">
            <CardContent className="p-20 text-center text-muted-foreground">
                <Tag className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>No active coupons found at this time.</p>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map(coupon => (
            <Card key={coupon.id} className="shadow-sm hover:shadow-md transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Tag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-mono font-bold">{coupon.code}</CardTitle>
                      <div className="mt-1">
                        <StatusBadge status={coupon.status} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {coupon.discountType === "percentage" ? (
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-0 gap-1 font-bold">
                      <Percent className="h-3.5 w-3.5" /> {coupon.value}% OFF
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-0 gap-1 font-bold">
                      <DollarSign className="h-3.5 w-3.5" /> ${coupon.value} OFF
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                  <div>
                    <p className="mb-0.5">Valid From</p>
                    <p className="text-foreground">{coupon.validFrom}</p>
                  </div>
                  <div>
                    <p className="mb-0.5">Expires On</p>
                    <p className="text-foreground">{coupon.validTo}</p>
                  </div>
                </div>

                {coupon.applicableProducts.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-widest font-bold">Applicable to:</p>
                    <div className="flex flex-wrap gap-1">
                      {coupon.applicableProducts.map(p => (
                        <Badge key={p} variant="outline" className="text-[9px] px-1.5 h-5 bg-muted/30">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Coupons;