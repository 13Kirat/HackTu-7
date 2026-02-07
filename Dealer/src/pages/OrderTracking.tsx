import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ShipmentTimeline } from "@/components/shared/ShipmentTimeline";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types";

const OrderTracking = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    orderService.getOrders().then(setOrders);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Order Tracking</h1>
        <p className="text-muted-foreground">Track all your orders and shipments</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Est. Delivery</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelected(order)}>
                    <TableCell className="font-medium text-primary">{order.id}</TableCell>
                    <TableCell className="capitalize">{order.type}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">${order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{order.estimatedDelivery ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={order.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order {selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Type:</span> <span className="capitalize font-medium">{selected.type}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={selected.status} /></div>
                <div><span className="text-muted-foreground">Amount:</span> <span className="font-medium">${selected.totalAmount.toLocaleString()}</span></div>
                <div><span className="text-muted-foreground">Date:</span> {selected.date}</div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Products</h4>
                {selected.products.map((p, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{p.quantity}× {p.productName} — ${(p.quantity * p.price).toLocaleString()}</p>
                ))}
              </div>
              {selected.timeline && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Shipment Timeline</h4>
                  <ShipmentTimeline events={selected.timeline} />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderTracking;
