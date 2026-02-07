import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Package, DollarSign, ShoppingCart, AlertTriangle, ArrowRight } from "lucide-react";
import { inventoryService } from "@/services/inventoryService";
import { orderService } from "@/services/orderService";
import { alertService } from "@/services/alertService";
import type { Order, Alert as AlertType, InventoryItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    orderService.getOrders().then(setOrders);
    alertService.getAlerts().then(setAlerts);
    inventoryService.getInventory().then(setInventory);
  }, []);

  const totalValue = inventory.reduce((sum, i) => sum + i.availableStock * 150, 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const activeAlerts = alerts.filter(a => a.type === "low_stock" && a.status === "active").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Metro Dealers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Inventory Value" value={`$${totalValue.toLocaleString()}`} icon={DollarSign} trend="+12.5% from last month" />
        <StatCard title="Products in Stock" value={inventory.length.toString()} icon={Package} trend="+3 new items" />
        <StatCard title="Pending Orders" value={pendingOrders.toString()} icon={ShoppingCart} variant="warning" />
        <StatCard title="Low Stock Alerts" value={activeAlerts.toString()} icon={AlertTriangle} variant="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/order-tracking")} className="text-muted-foreground">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell className="capitalize">{order.type}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">${order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell><StatusBadge status={order.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Active Alerts</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/alerts")} className="text-muted-foreground">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.filter(a => a.status === "active").slice(0, 4).map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
                <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${alert.type === "low_stock" ? "text-destructive" : "text-warning"}`} />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{alert.productName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Stock: {alert.currentStock} / {alert.threshold}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
