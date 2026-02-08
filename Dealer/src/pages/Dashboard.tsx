import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Package, DollarSign, ShoppingCart, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { inventoryService } from "@/services/inventoryService";
import { orderService } from "@/services/orderService";
import { alertService } from "@/services/alertService";
import type { Order, Alert as AlertType, InventoryItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["dealer-orders"],
    queryFn: orderService.getOrders,
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["dealer-alerts"],
    queryFn: alertService.getAlerts,
  });

  const { data: inventory, isLoading: invLoading } = useQuery({
    queryKey: ["dealer-inventory"],
    queryFn: inventoryService.getInventory,
  });

  const totalValue = inventory?.reduce((sum, i) => sum + i.availableStock * 150, 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === "pending").length || 0;
  const activeAlerts = alerts?.filter(a => a.status === "active").length || 0;

  const isLoading = ordersLoading || alertsLoading || invLoading;

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name || 'Dealer'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Inventory Value" value={`$${totalValue.toLocaleString()}`} icon={DollarSign} trend="+12.5% from last month" />
        <StatCard title="Products in Stock" value={inventory?.length.toString() || "0"} icon={Package} trend="+3 new items" />
        <StatCard title="Pending Orders" value={pendingOrders.toString()} icon={ShoppingCart} variant="warning" />
        <StatCard title="Active Alerts" value={activeAlerts.toString()} icon={AlertTriangle} variant="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/order-tracking")} className="text-muted-foreground">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {!orders || orders.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">No recent orders found.</div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.slice(0, 5).map(order => (
                    <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs truncate max-w-[100px]">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell className="text-right font-medium">${order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell><StatusBadge status={order.status} /></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Active Alerts</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/alerts")} className="text-muted-foreground">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {!alerts || alerts.filter(a => a.status === "active").length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm">No active alerts.</div>
            ) : (
                alerts.filter(a => a.status === "active").slice(0, 4).map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border transition-colors hover:bg-muted/50 cursor-pointer" onClick={() => navigate("/alerts")}>
                    <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${alert.type === "low_stock" ? "text-destructive" : "text-warning"}`} />
                    <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{alert.productName}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{alert.type.replace('_', ' ')}</p>
                    </div>
                </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;