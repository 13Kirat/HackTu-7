import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventoryService";
import { locationService } from "@/services/locationService";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
import { shipmentService } from "@/services/shipmentService";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, Truck } from "lucide-react";
import type { InventoryItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

export default function Inventory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [shipmentOpen, setShipmentOpen] = useState(false);
  
  // Form state
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [targetProduct, setTargetProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const { data: inventory, isLoading: invLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryService.getAll,
  });

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: locationService.getAll,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getAll,
  });

  const shipmentMutation = useMutation({
    mutationFn: async (payload: any) => {
      // 1. Create Order
      const order = await orderService.createDealerOrder({
        fromLocationId: payload.fromLoc,
        toLocationId: payload.toLoc,
        items: [{ productId: payload.productId, quantity: payload.quantity }]
      });
      // 2. Create Shipment for that order
      return await shipmentService.create({ orderId: order._id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({ title: "Shipment Created", description: "Stock has been reserved at source." });
      setShipmentOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to create shipment", variant: "destructive" });
    }
  });

  const resetForm = () => { setFromLoc(""); setToLoc(""); setTargetProduct(""); setQuantity(""); };

  const handleCreateShipment = () => {
    if (!fromLoc || !toLoc || !targetProduct || !quantity) {
      toast({ title: "Validation Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    shipmentMutation.mutate({ fromLoc, toLoc, productId: targetProduct, quantity: Number(quantity) });
  };

  const filtered = inventory?.filter((item) => {
    if (locationFilter !== "all" && item.locationType !== locationFilter) return false;
    // category filter would need mapping or backend support
    return true;
  });

  const columns = [
    { key: "productName", header: "Product" },
    { key: "sku", header: "SKU", render: (i: InventoryItem) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{i.sku}</code> },
    { key: "locationName", header: "Location", render: (i: InventoryItem) => (
      <div className="flex items-center gap-2">
        <span>{i.locationName}</span>
        <Badge variant="outline" className="text-xs capitalize">{i.locationType}</Badge>
      </div>
    )},
    { key: "totalStock", header: "Total" },
    { key: "reservedStock", header: "Reserved" },
    { key: "availableStock", header: "Available", render: (i: InventoryItem) => (
      <span className={i.availableStock <= i.reorderLevel ? "text-destructive font-medium" : ""}>
        {i.availableStock}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Management" description="Monitor and manage stock across the network">
        <Dialog open={shipmentOpen} onOpenChange={setShipmentOpen}>
          <DialogTrigger asChild>
            <Button><Truck className="mr-2 h-4 w-4" />Create Shipment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Inter-Location Shipment</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Source (From)</Label>
                <Select value={fromLoc} onValueChange={setFromLoc}>
                  <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent>{locations?.filter(l => l.type !== 'dealer').map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destination (To)</Label>
                <Select value={toLoc} onValueChange={setToLoc}>
                  <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                  <SelectContent>{locations?.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Product</Label>
                <Select value={targetProduct} onValueChange={setTargetProduct}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>{products?.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" placeholder="Enter quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleCreateShipment} disabled={shipmentMutation.isPending}>
                {shipmentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm & Ship
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="factory">Factory</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
            <SelectItem value="dealer">Dealer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {invLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable data={filtered || []} columns={columns} searchKey="productName" searchPlaceholder="Search products..." />
      )}
    </div>
  );
}
