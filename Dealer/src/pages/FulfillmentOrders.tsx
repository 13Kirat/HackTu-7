import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Plus } from "lucide-react";
import { orderService } from "@/services/orderService";
import { inventoryService } from "@/services/inventoryService";
import { toast } from "sonner";
import type { Order, Product } from "@/types";

const warehouses = ["Warehouse A", "Warehouse B", "Warehouse C"];

const FulfillmentOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [warehouse, setWarehouse] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    orderService.getFulfillmentOrders().then(setOrders);
    inventoryService.getProducts().then(setProducts);
  }, []);

  const selectedProduct = products.find(p => p.id === productId);
  const total = selectedProduct ? selectedProduct.price * Number(quantity || 0) : 0;

  const handleSubmit = () => {
    if (!warehouse || !productId || !quantity) return;
    toast.success("Order placed successfully!", { description: `Order for ${quantity} × ${selectedProduct?.name} submitted.` });
    setOpen(false);
    setWarehouse("");
    setProductId("");
    setQuantity("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fulfillment Orders</h1>
          <p className="text-muted-foreground">Orders from warehouse to your dealership</p>
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
                <Label>Warehouse</Label>
                <Select value={warehouse} onValueChange={setWarehouse}>
                  <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                  <SelectContent>
                    {warehouses.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Product</Label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name} — ${p.price}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Enter quantity" />
              </div>
              {total > 0 && (
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm font-medium">Order Total: <span className="text-primary">${total.toLocaleString()}</span></p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!warehouse || !productId || !quantity}>Confirm Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.warehouse}</TableCell>
                    <TableCell className="max-w-48 truncate">{order.products.map(p => p.productName).join(", ")}</TableCell>
                    <TableCell className="text-right">${order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell><StatusBadge status={order.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FulfillmentOrders;
