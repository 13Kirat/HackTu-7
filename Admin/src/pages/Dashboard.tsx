import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package, MapPin, ShoppingCart, AlertTriangle, ArrowUpDown, TrendingUp,
} from "lucide-react";
import { alerts, inventory, orders, products, locations } from "@/mock/data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const totalStock = inventory.reduce((s, i) => s + i.totalStock, 0);
const reservedStock = inventory.reduce((s, i) => s + i.reservedStock, 0);
const availableStock = inventory.reduce((s, i) => s + i.availableStock, 0);

const stockByType = [
  { name: "Factories", stock: inventory.filter((i) => i.locationType === "factory").reduce((s, i) => s + i.totalStock, 0) },
  { name: "Warehouses", stock: inventory.filter((i) => i.locationType === "warehouse").reduce((s, i) => s + i.totalStock, 0) },
  { name: "Dealers", stock: inventory.filter((i) => i.locationType === "dealer").reduce((s, i) => s + i.totalStock, 0) },
];

const alertColors: Record<string, string> = {
  low_stock: "destructive",
  overstock: "secondary",
  high_demand: "default",
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Company-wide supply chain overview" />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Stock" value={totalStock.toLocaleString()} icon={Package} trend={{ value: 12, positive: true }} />
        <StatCard title="Reserved" value={reservedStock.toLocaleString()} icon={ArrowUpDown} description={`${availableStock.toLocaleString()} available`} />
        <StatCard title="Total Orders" value={orders.length} icon={ShoppingCart} trend={{ value: 8, positive: true }} />
        <StatCard title="Active Locations" value={locations.length} icon={MapPin} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Stock by Location Type */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Stock by Location Type</CardTitle>
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
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex flex-col gap-1 rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <Badge variant={alertColors[alert.type] as any} className="text-xs">
                    {alert.type.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm font-medium">{alert.productName}</p>
                <p className="text-xs text-muted-foreground">{alert.locationName}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Products" value={products.length} icon={Package} />
        <StatCard title="Pending Orders" value={orders.filter((o) => o.status === "pending").length} icon={ShoppingCart} />
        <StatCard title="Active Alerts" value={alerts.length} icon={TrendingUp} />
      </div>
    </div>
  );
}
