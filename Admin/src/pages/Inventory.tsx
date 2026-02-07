import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight } from "lucide-react";
import { inventory, locations, products } from "@/mock/data";
import type { InventoryItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

export default function Inventory() {
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [transferOpen, setTransferOpen] = useState(false);
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [transferProduct, setTransferProduct] = useState("");
  const [transferQty, setTransferQty] = useState("");
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Derive categories from products
  const categories = [...new Set(products.map((p) => p.category))];

  // Map product IDs to categories for filtering
  const productCategoryMap = Object.fromEntries(products.map((p) => [p.id, p.category]));

  const filtered = inventory.filter((item) => {
    if (locationFilter !== "all" && item.locationType !== locationFilter) return false;
    if (regionFilter !== "all" && item.region !== regionFilter) return false;
    if (categoryFilter !== "all" && productCategoryMap[item.productId] !== categoryFilter) return false;
    return true;
  });

  const handleTransfer = () => {
    if (!fromLoc || !toLoc || !transferProduct || !transferQty) {
      toast({ title: "Validation Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (fromLoc === toLoc) {
      toast({ title: "Validation Error", description: "Source and destination must be different", variant: "destructive" });
      return;
    }
    toast({ title: "Transfer Created", description: `Transferred ${transferQty} units successfully.` });
    addNotification({ type: "success", title: "Stock Transfer", message: `${transferQty} units transferred between locations` });
    setTransferOpen(false);
    setFromLoc(""); setToLoc(""); setTransferProduct(""); setTransferQty("");
  };

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
    { key: "reorderLevel", header: "Reorder Level" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Management" description="Combined inventory across all locations">
        <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
          <DialogTrigger asChild>
            <Button><ArrowLeftRight className="mr-2 h-4 w-4" />Transfer Stock</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Stock Transfer</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>From Location</Label>
                <Select value={fromLoc} onValueChange={setFromLoc}>
                  <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent>{locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To Location</Label>
                <Select value={toLoc} onValueChange={setToLoc}>
                  <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                  <SelectContent>{locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Product</Label>
                <Select value={transferProduct} onValueChange={setTransferProduct}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" placeholder="Enter quantity" value={transferQty} onChange={(e) => setTransferQty(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleTransfer}>Confirm Transfer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="factory">Factory</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
            <SelectItem value="dealer">Dealer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="North">North</SelectItem>
            <SelectItem value="South">South</SelectItem>
            <SelectItem value="East">East</SelectItem>
            <SelectItem value="West">West</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filtered} columns={columns} searchKey="productName" searchPlaceholder="Search products..." />
    </div>
  );
}
