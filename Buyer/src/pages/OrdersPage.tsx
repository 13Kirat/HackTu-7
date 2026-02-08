import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderService } from '@/services';
import OrderTimeline from '@/components/OrderTimeline';
import StatCard from '@/components/StatCard';
import { Badge } from '@/components/ui/badge';
import { Package, DollarSign, TrendingUp, ChevronRight, Loader2, MapPin, Truck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const statusStyles: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  confirmed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  shipped: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  delivered: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const trackId = searchParams.get('track');
  const [selected, setSelected] = useState<any | null>(null);

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['buyer-orders'],
    queryFn: orderService.getOrders
  });

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['buyer-order-summary'],
    queryFn: orderService.getSummary
  });

  const { data: trackingData, isLoading: trackingLoading } = useQuery({
    queryKey: ['buyer-order-tracking', trackId],
    queryFn: () => orderService.getTracking(trackId as string),
    enabled: !!trackId
  });

  const isLoading = ordersLoading || summaryLoading;

  return (
    <div className="container py-6">
      <h1 className="font-heading text-2xl font-bold mb-6">Order History</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard 
            title="Total Orders" 
            value={summary?.totalOrders || 0} 
            icon={<Package className="h-5 w-5" />} 
        />
        <StatCard 
            title="Lifetime Spend" 
            value={`₹${(summary?.totalSpending || 0).toLocaleString()}`} 
            icon={<DollarSign className="h-5 w-5" />} 
        />
        <StatCard 
            title="Favorite Product" 
            value={summary?.mostOrderedProducts?.[0]?.product?.name || "—"} 
            icon={<TrendingUp className="h-5 w-5" />} 
            subtitle={summary?.mostOrderedProducts?.[0]?.quantity ? `${summary.mostOrderedProducts[0].quantity} units ordered` : ""}
        />
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground font-medium">Fetching orders...</p>
            </div>
        ) : !orders || orders.length === 0 ? (
            <div className="text-center py-20 rounded-xl border border-dashed bg-muted/30">
                <Package className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="font-heading font-semibold text-muted-foreground">No orders found</p>
                <Button variant="link" onClick={() => navigate('/')}>Browse Products</Button>
            </div>
        ) : (
            orders.map((order: any) => (
            <button
                key={order.id}
                onClick={() => setSelected(order)}
                className="w-full flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-md transition-all text-left group"
            >
                <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs uppercase tracking-tighter text-muted-foreground group-hover:text-primary transition-colors">
                        {order.id.slice(-8)}
                    </span>
                    <Badge variant="outline" className={`text-[9px] uppercase font-bold tracking-widest h-5 ${statusStyles[order.status]}`}>
                    {order.status}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{order.date} · {order.items.length} product(s)</p>
                </div>
                <div className="text-right mr-2">
                    <span className="font-heading font-bold text-lg">₹{order.total.toLocaleString()}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all shrink-0" />
            </button>
            ))
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md border-primary/10">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Order Details
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-6 pt-4">
              <div className="space-y-3 rounded-lg bg-muted/50 p-4 border border-border/50">
                {selected.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate">{item.productName}</p>
                        <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold ml-4">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t border-border/50 pt-3 mt-3 text-base">
                  <span>Grand Total</span>
                  <span className="text-primary font-black">₹{selected.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">{selected.date}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Status</p>
                    <Badge variant="outline" className={`text-[9px] uppercase font-bold tracking-widest h-5 ${statusStyles[selected.status]}`}>
                        {selected.status}
                    </Badge>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Shipping Address
                </p>
                <p className="text-xs bg-muted/30 p-3 rounded border italic">
                    {selected.shippingAddress}
                </p>
              </div>

              <div className="pt-2">
                <Button className="w-full font-bold h-11 shadow-sm" onClick={() => {
                    setSelected(null);
                    setSearchParams({ track: selected.id });
                }}>
                    Track Delivery
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tracking Dialog */}
      <Dialog open={!!trackId} onOpenChange={(open) => { if(!open) setSearchParams({}); }}>
        <DialogContent className="max-w-md border-primary/10">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Live Tracking
            </DialogTitle>
          </DialogHeader>
          
          {trackingLoading ? (
              <div className="py-10 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Connecting to delivery service...</p>
              </div>
          ) : !trackingData ? (
              <div className="py-10 text-center text-muted-foreground">Tracking information unavailable.</div>
          ) : (
            <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Status</p>
                        <p className="text-lg font-black uppercase tracking-tighter text-primary">{trackingData.status}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Order ID</p>
                        <p className="text-xs font-mono font-bold">#{trackId?.slice(-8).toUpperCase()}</p>
                    </div>
                </div>

                {trackingData.shipment && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 px-1">
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Carrier</p>
                                <p className="text-sm font-semibold">{trackingData.shipment.carrier || 'Standard Shipping'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Tracking #</p>
                                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{trackingData.shipment.trackingNumber || 'N/A'}</code>
                            </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="px-1">
                            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4">Journey Timeline</p>
                            <OrderTimeline events={trackingData.shipment.timeline || []} />
                        </div>
                    </div>
                )}

                <Button variant="outline" className="w-full font-bold h-11 mt-2" onClick={() => setSearchParams({})}>
                    Close Tracking
                </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
