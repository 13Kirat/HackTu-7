import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ShipmentTimeline } from "@/components/shared/ShipmentTimeline";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types";
import { Loader2, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { shipmentService } from "@/services/shipmentService";

const OrderTracking = () => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Order | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["dealer-tracking-orders"],
    queryFn: orderService.getOrders,
  });

  const deliverMutation = useMutation({
    mutationFn: async (orderId: string) => {
        // Find shipment for this order
        const shipments = await shipmentService.getAll();
        const shipment = shipments.find((s: any) => (s.orderId?._id || s.orderId) === orderId);
        if (!shipment) throw new Error("Shipment not found");
        return await shipmentService.updateStatus(shipment._id, "delivered");
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["dealer-tracking-orders"] });
        queryClient.invalidateQueries({ queryKey: ["dealer-inventory"] });
        toast.success("Order marked as received. Inventory updated.");
        setSelected(null);
    },
    onError: (error: any) => {
        toast.error(error.message || "Failed to update order");
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Order Tracking</h1>
        <p className="text-muted-foreground">Monitor delivery status and fulfillment timelines</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : !orders || orders.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">No orders tracked yet.</div>
          ) : (
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
                        <TableCell className="font-mono text-xs text-primary font-medium">{order.id}</TableCell>
                        <TableCell className="capitalize text-xs">{order.type}</TableCell>
                        <TableCell className="text-xs">{order.date}</TableCell>
                        <TableCell className="text-right font-medium text-xs">${order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-xs">{order.estimatedDelivery ?? "—"}</TableCell>
                        <TableCell><StatusBadge status={order.status} /></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Track Order — {selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground block mb-1">Source</span> <span className="font-medium">{selected.dealerName}</span></div>
                <div><span className="text-muted-foreground block mb-1">Status</span> <StatusBadge status={selected.status} /></div>
                <div><span className="text-muted-foreground block mb-1">Amount</span> <span className="font-medium">${selected.totalAmount.toLocaleString()}</span></div>
                <div><span className="text-muted-foreground block mb-1">Date</span> {selected.date}</div>
                {selected.trackingNumber && <div className="col-span-2"><span className="text-muted-foreground block mb-1">Tracking ({selected.carrier})</span> <code className="bg-muted px-1.5 py-0.5 rounded">{selected.trackingNumber}</code></div>}
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-semibold mb-3">Shipment Timeline</h4>
                {selected.timeline && selected.timeline.length > 0 ? (
                    <ShipmentTimeline events={selected.timeline} />
                ) : (
                    <p className="text-xs text-muted-foreground italic">Order is being processed...</p>
                )}
              </div>

              {selected.status === 'shipped' && (
                  <Button className="w-full" onClick={() => deliverMutation.mutate(selected.id)} disabled={deliverMutation.isPending}>
                      {deliverMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PackageCheck className="h-4 w-4 mr-2" />}
                      Mark as Received
                  </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderTracking;