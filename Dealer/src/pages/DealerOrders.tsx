import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { orderService } from "@/services/orderService";
import { locationService } from "@/services/locationService";
import { inventoryService } from "@/services/inventoryService";
import type { Order } from "@/types";
import { useAuth } from "@/components/AuthProvider";
import { Loader2, Plus, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

const DealerOrders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [sourceDealerId, setSourceDealerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["dealer-to-dealer-orders"],
    queryFn: orderService.getDealerOrders,
  });

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: locationService.getAll,
  });

  const { data: products } = useQuery({
    queryKey: ["dealer-products"],
    queryFn: inventoryService.getProducts,
  });

  const otherDealers = locations?.filter(l => l.type === 'dealer' && l.id !== user?.locationId) || [];

  const orderMutation = useMutation({
    mutationFn: orderService.createDealerOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dealer-to-dealer-orders"] });
      toast.success("Peer-to-peer order placed!");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  });

  const resetForm = () => {
    setSourceDealerId("");
    setProductId("");
    setQuantity("");
  };

  const handleOrderSubmit = () => {
    if (!sourceDealerId || !productId || !quantity) return;
    orderMutation.mutate({
      fromLocationId: sourceDealerId,
      toLocationId: user?.locationId,
      items: [{ productId, quantity: Number(quantity) }]
    });
  };

  const sent = orders?.filter(o => o.targetDealer === user?.name) || [];
  const received = orders?.filter(o => o.dealerName === user?.name) || [];

  const OrderTable = ({ data }: { data: Order[] }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Counterparty</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(order => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs truncate max-w-[100px]">{order.id}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.dealerName === user?.name ? order.targetDealer : order.dealerName}</TableCell>
              <TableCell className="max-w-40 truncate">{order.products.map(p => p.productName).join(", ")}</TableCell>
              <TableCell className="text-right font-medium">${order.totalAmount.toLocaleString()}</TableCell>
              <TableCell><StatusBadge status={order.status} /></TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-16">No orders found</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dealer-to-Dealer Orders</h1>
          <p className="text-muted-foreground">Manage peer-level stock movement and requests</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Peer Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Stock from Another Dealer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Source Dealer</Label>
                <Select value={sourceDealerId} onValueChange={setSourceDealerId}>
                  <SelectTrigger><SelectValue placeholder="Select dealer" /></SelectTrigger>
                  <SelectContent>
                    {otherDealers.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Product</Label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    {products?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Enter quantity" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleOrderSubmit} disabled={!sourceDealerId || !productId || !quantity || orderMutation.isPending}>
                {orderMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <Tabs defaultValue="sent">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="sent">Sent (Orders I Placed)</TabsTrigger>
                <TabsTrigger value="received">Received (Incoming Requests)</TabsTrigger>
                </TabsList>
                <TabsContent value="sent" className="mt-4">
                <OrderTable data={sent} />
                </TabsContent>
                <TabsContent value="received" className="mt-4">
                <OrderTable data={received} />
                </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DealerOrders;
