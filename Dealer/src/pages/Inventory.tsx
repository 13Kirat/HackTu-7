import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle } from "lucide-react";
import { inventoryService } from "@/services/inventoryService";
import type { InventoryItem } from "@/types";

const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    inventoryService.getInventory().then(setItems);
  }, []);

  const filtered = items.filter(i =>
    i.productName.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground">Monitor stock levels and reorder points</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Reserved</TableHead>
                  <TableHead className="text-right">Available</TableHead>
                  <TableHead className="text-right">Reorder Level</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(item => {
                  const isLow = item.availableStock <= item.reorderLevel;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">{item.sku}</TableCell>
                      <TableCell className="text-right">{item.totalStock}</TableCell>
                      <TableCell className="text-right">{item.reservedStock}</TableCell>
                      <TableCell className={`text-right font-medium ${isLow ? "text-destructive" : ""}`}>{item.availableStock}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{item.reorderLevel}</TableCell>
                      <TableCell>
                        {isLow ? (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
                            <AlertTriangle className="h-3 w-3" /> Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">In Stock</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
