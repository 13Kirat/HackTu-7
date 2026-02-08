import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package, MapPin, ShoppingCart, AlertTriangle, ArrowUpDown, TrendingUp, Loader2
} from "lucide-react";
import { inventoryService } from "@/services/inventoryService";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import { locationService } from "@/services/locationService";
import api from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const alertColors: Record<string, string> = {
  low_stock: "destructive",
  overstock: "secondary",
  high_demand: "default",
};

export default function Dashboard() {
  const { data: inventory, isLoading: invLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryService.getAll,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderService.getAll,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getAll,
  });

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: locationService.getAll,
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
        const res = await api.get("/alerts");
        return res.data;
    },
  });

  const totalStock = inventory?.reduce((s, i) => s + i.totalStock, 0) || 0;
  const reservedStock = inventory?.reduce((s, i) => s + i.reservedStock, 0) || 0;
  const availableStock = inventory?.reduce((s, i) => s + i.availableStock, 0) || 0;

  // Since inventory/company is grouped by product, stockByType needs a different aggregation or mock
  const stockByType = [
    { name: "Factories", stock: totalStock * 0.6 },
    { name: "Warehouses", stock: totalStock * 0.3 },
    { name: "Dealers", stock: totalStock * 0.1 },
  ];

  const isLoading = invLoading || ordersLoading || alertsLoading;

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Company-wide supply chain overview" />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Stock" value={totalStock.toLocaleString()} icon={Package} trend={{ value: 12, positive: true }} />
        <StatCard title="Reserved" value={reservedStock.toLocaleString()} icon={ArrowUpDown} description={`${availableStock.toLocaleString()} available`} />
        <StatCard title="Total Orders" value={orders?.length || 0} icon={ShoppingCart} trend={{ value: 8, positive: true }} />
        <StatCard title="Active Locations" value={locations?.length || 0} icon={MapPin} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Stock by Location Type */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">Stock Distribution Estimate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stockByType}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[260px] overflow-y-auto">
            {!alerts || alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">No active alerts.</p>
            ) : (
                alerts.map((alert: any) => (
                <div key={alert._id} className="flex flex-col gap-1 rounded-md border p-3 bg-muted/30">
                    <div className="flex items-center justify-between">
                    <Badge variant={alertColors[alert.type] as any} className="text-[10px] uppercase tracking-wider">
                        {alert.type.replace("_", " ")}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                        {new Date(alert.createdAt).toLocaleDateString()}
                    </span>
                    </div>
                    <p className="text-xs font-medium mt-1">{alert.message}</p>
                </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Products" value={products?.length || 0} icon={Package} />
        <StatCard title="Pending Orders" value={orders?.filter((o: any) => o.status === "pending").length || 0} icon={ShoppingCart} />
        <StatCard title="Critical Alerts" value={alerts?.filter((a: any) => a.severity === 'high' || a.severity === 'critical').length || 0} icon={TrendingUp} />
      </div>
    </div>
  );
}