import { useState, useEffect } from 'react';
import { orderService } from '@/services';
import { Order } from '@/types';
import OrderTimeline from '@/components/OrderTimeline';
import StatCard from '@/components/StatCard';
import { Badge } from '@/components/ui/badge';
import { Package, DollarSign, TrendingUp, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const statusStyles: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  confirmed: 'bg-primary/10 text-primary',
  shipped: 'bg-warning/10 text-warning',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    orderService.getOrders().then(setOrders);
  }, []);

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="container py-6">
      <h1 className="font-heading text-2xl font-bold mb-6">Orders</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Orders" value={orders.length} icon={<Package className="h-5 w-5" />} />
        <StatCard title="Total Spent" value={`₹${totalSpent.toFixed(2)}`} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Most Ordered" value="Oak Panel" icon={<TrendingUp className="h-5 w-5" />} subtitle="3 times" />
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {orders.map(order => (
          <button
            key={order.id}
            onClick={() => setSelected(order)}
            className="w-full flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-semibold text-sm">{order.id}</span>
                <Badge variant="outline" className={`text-[10px] ${statusStyles[order.status]}`}>
                  {order.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{order.date} · {order.items.length} items</p>
            </div>
            <span className="font-heading font-bold">₹{order.total.toFixed(2)}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Order {selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="space-y-1 text-sm">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1">
                    <span>{item.productName} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{selected.total.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Shipping to</p>
                <p className="text-sm">{selected.shippingAddress}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-3">Shipment Timeline</p>
                <OrderTimeline events={selected.timeline} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
