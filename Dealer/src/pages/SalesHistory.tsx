import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/shared/StatCard";
import { DollarSign, TrendingUp, Package, Loader2, ReceiptText, Plus } from "lucide-react";
import { dealerService } from "@/services/dealerService";
import { orderService } from "@/services/orderService";
import { inventoryService } from "@/services/inventoryService";
import type { Sale } from "@/types";
import { toast } from "sonner";

const SalesHistory = () => {
  const queryClient = useQueryClient();
  const [billOpen, setBillOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const { data: sales, isLoading: salesLoading } = useQuery({
    queryKey: ["dealer-sales-history"],
    queryFn: dealerService.getSalesHistory,
  });

  const { data: products } = useQuery({
    queryKey: ["dealer-products"],
    queryFn: inventoryService.getProducts,
  });

  const billMutation = useMutation({
    mutationFn: orderService.createOfflineBill,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["dealer-sales-history"] });
        queryClient.invalidateQueries({ queryKey: ["dealer-inventory"] });
        toast.success("Offline bill generated and inventory updated.");
        setBillOpen(false);
        resetForm();
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to generate bill");
    }
  });

  const resetForm = () => {
    setProductId("");
    setQuantity("");
  };

  const selectedProduct = products?.find(p => p.id === productId);
  const total = selectedProduct ? selectedProduct.price * Number(quantity || 0) : 0;

  const handleGenerateBill = () => {
    if (!productId || !quantity) return;
    billMutation.mutate({
        items: [{ productId, quantity: Number(quantity) }]
    });
  };

  const stats = useMemo(() => {
    if (!sales) return { totalRevenue: 0, totalUnits: 0, topProduct: "—" };
    const totalRevenue = sales.reduce((s, sale) => s + sale.revenue, 0);
    const totalUnits = sales.reduce((s, sale) => s + sale.quantitySold, 0);
    const productRevenue: Record<string, number> = {};
    sales.forEach(s => { productRevenue[s.productName] = (productRevenue[s.productName] || 0) + s.revenue; });
    const topProduct = Object.entries(productRevenue).sort((a, b) => b[1] - a[1])[0];
    return { totalRevenue, totalUnits, topProduct: topProduct?.[0] ?? "—" };
  }, [sales]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales History</h1>
          <p className="text-muted-foreground">Track your sales performance and generate offline bills</p>
        </div>
        <Dialog open={billOpen} onOpenChange={setBillOpen}>
          <DialogTrigger asChild>
            <Button><ReceiptText className="h-4 w-4 mr-2" /> Generate Offline Bill</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Offline Customer Sale</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
                <Input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Enter quantity sold" />
              </div>
              {total > 0 && (
                <div className="p-3 rounded-lg bg-muted border border-primary/10">
                  <p className="text-sm font-medium">Bill Amount: <span className="text-primary font-bold">${total.toLocaleString()}</span></p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase">Stock will be deducted immediately upon confirmation.</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBillOpen(false)}>Cancel</Button>
              <Button onClick={handleGenerateBill} disabled={!productId || !quantity || billMutation.isPending}>
                {billMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm & Generate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} trend="+18.2%" />
        <StatCard title="Top Product" value={stats.topProduct} icon={TrendingUp} />
        <StatCard title="Units Sold" value={stats.totalUnits.toLocaleString()} icon={Package} trend="+245 this week" />
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Sales Records</CardTitle>
        </CardHeader>
        <CardContent>
          {salesLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : !sales || sales.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">No sales recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sales.map(s => (
                    <TableRow key={s.id}>
                        <TableCell className="font-medium text-sm">{s.productName}</TableCell>
                        <TableCell className="text-right text-xs">{s.quantitySold}</TableCell>
                        <TableCell className="text-right font-medium text-sm">${s.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{s.date}</TableCell>
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

export default SalesHistory;
