import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { inventoryService } from "@/services/inventoryService";
import type { Product } from "@/types";

const Products = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["dealer-products"],
    queryFn: inventoryService.getProducts,
  });

  const { data: categories } = useQuery({
    queryKey: ["dealer-categories"],
    queryFn: inventoryService.getCategories,
  });

  const filtered = products?.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || p.category === category;
    return matchSearch && matchCategory;
  });

  if (productsLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Product Catalog</h1>
        <p className="text-muted-foreground">Browse available products, pricing, and active schemes</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {!filtered || filtered.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">No products found matching your search.</div>
          ) : (
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Company Stock</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Schemes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filtered.map(p => (
                    <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs">{p.sku}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell className="text-right font-medium">₹{p.price.toLocaleString()}</TableCell>
                        <TableCell className={`text-right ${p.stock < 50 ? "text-destructive font-medium" : ""}`}>{p.stock}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.warehouse}</TableCell>
                        <TableCell>
                        <div className="flex gap-1 flex-wrap">
                            {p.schemes?.map(s => <Badge key={s} variant="secondary" className="text-[10px] uppercase font-bold tracking-tight">{s}</Badge>)}
                            {(!p.schemes || p.schemes.length === 0) && <span className="text-muted-foreground text-xs">—</span>}
                        </div>
                        </TableCell>
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

export default Products;