import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Plus, Loader2 } from "lucide-react";
import { orderService } from "@/services/orderService";
import { inventoryService } from "@/services/inventoryService";
import { locationService } from "@/services/locationService";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

const FulfillmentOrders = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [warehouseId, setWarehouseId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["fulfillment-orders"],
    queryFn: orderService.getFulfillmentOrders,
  });

  const { data: products } = useQuery({
    queryKey: ["dealer-products"],
    queryFn: inventoryService.getProducts,
  });

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: locationService.getAll,
  });

  const warehouses = locations?.filter(l => l.type === 'warehouse' || l.type === 'factory') || [];

  const orderMutation = useMutation({
    mutationFn: orderService.createDealerOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fulfillment-orders"] });
      toast.success("Order placed successfully!");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  });

  const resetForm = () => {
    setWarehouseId("");
    setProductId("");
    setQuantity("");
  };

  const selectedProduct = products?.find(p => p.id === productId);
  const total = selectedProduct ? selectedProduct.price * Number(quantity || 0) : 0;

  const handleSubmit = () => {
    if (!warehouseId || !productId || !quantity) return;
    orderMutation.mutate({
      fromLocationId: warehouseId,
      toLocationId: user?.locationId,
      items: [{ productId, quantity: Number(quantity) }]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fulfillment Orders</h1>
          <p className="text-muted-foreground">Orders from warehouses to your dealership</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Place Fulfillment Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Source (Warehouse/Factory)</Label>
                <Select value={warehouseId} onValueChange={setWarehouseId}>
                  <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent>
                    {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Product</Label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    {products?.map(p => <SelectItem key={p.id} value={p.id}>{p.name} — ${p.price}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Enter quantity" />
              </div>
              {total > 0 && (
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm font-medium">Estimated Total: <span className="text-primary">${total.toLocaleString()}</span></p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!warehouseId || !productId || !quantity || orderMutation.isPending}>
                {orderMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {ordersLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : !orders || orders.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">No fulfillment orders found.</div>
          ) : (
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map(order => (
                    <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs truncate max-w-[100px]">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.warehouse}</TableCell>
                        <TableCell className="max-w-48 truncate">{order.products.map((p: any) => p.productName).join(", ")}</TableCell>
                        <TableCell className="text-right font-medium">${order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell><StatusBadge status={order.status} /></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FulfillmentOrders;