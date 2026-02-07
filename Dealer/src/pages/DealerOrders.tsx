import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types";

const DealerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    orderService.getDealerOrders().then(setOrders);
  }, []);

  const sent = orders.filter(o => o.dealerName === "Metro Dealers");
  const received = orders.filter(o => o.targetDealer === "Metro Dealers");

  const OrderTable = ({ data }: { data: Order[] }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Dealer</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Commission</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(order => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.dealerName === "Metro Dealers" ? order.targetDealer : order.dealerName}</TableCell>
              <TableCell className="max-w-40 truncate">{order.products.map(p => p.productName).join(", ")}</TableCell>
              <TableCell className="text-right">${order.totalAmount.toLocaleString()}</TableCell>
              <TableCell className="text-right text-muted-foreground">${order.commission?.toFixed(2) ?? "—"}</TableCell>
              <TableCell><StatusBadge status={order.status} /></TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No orders found</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dealer-to-Dealer Orders</h1>
        <p className="text-muted-foreground">Manage orders between dealers</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <Tabs defaultValue="sent">
            <TabsList>
              <TabsTrigger value="sent">Sent ({sent.length})</TabsTrigger>
              <TabsTrigger value="received">Received ({received.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="sent" className="mt-4">
              <OrderTable data={sent} />
            </TabsContent>
            <TabsContent value="received" className="mt-4">
              <OrderTable data={received} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealerOrders;
