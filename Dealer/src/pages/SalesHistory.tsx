import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/shared/StatCard";
import { DollarSign, TrendingUp, Package, Loader2 } from "lucide-react";
import { dealerService } from "@/services/dealerService";
import type { Sale } from "@/types";

const SalesHistory = () => {
  const { data: sales, isLoading } = useQuery({
    queryKey: ["dealer-sales-history"],
    queryFn: dealerService.getSalesHistory,
  });

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales History</h1>
        <p className="text-muted-foreground">Detailed records of fulfilled customer orders</p>
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
          {isLoading ? (
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