import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventoryService";
import { shipmentService } from "@/services/shipmentService";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { InventoryMovement } from "@/types";
import { Factory, Warehouse, Store, User, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const journeySteps = [
  { label: "Factory", icon: Factory, color: "bg-chart-1" },
  { label: "Warehouse", icon: Warehouse, color: "bg-chart-2" },
  { label: "Dealer", icon: Store, color: "bg-chart-3" },
  { label: "Customer", icon: User, color: "bg-chart-4" },
];

const movementColors: Record<string, string> = {
  transfer: "default",
  sale: "secondary",
  return: "destructive",
  manufacture: "outline",
};

export default function ProductTracking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: movements, isLoading: movementsLoading } = useQuery({
    queryKey: ["movements"],
    queryFn: inventoryService.getMovements,
  });

  const { data: shipments, isLoading: shipmentsLoading } = useQuery({
    queryKey: ["shipments"],
    queryFn: shipmentService.getAll,
  });

  const deliverMutation = useMutation({
    mutationFn: (id: string) => shipmentService.updateStatus(id, "delivered"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({ title: "Shipment Delivered", description: "Stock has been moved to destination." });
    },
  });

  const failMutation = useMutation({
    mutationFn: (id: string) => shipmentService.updateStatus(id, "failed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({ title: "Shipment Failed", description: "Reserved stock has been released back to source." });
    },
  });

  const movementColumns = [
    { key: "date", header: "Date", render: (m: InventoryMovement) => new Date(m.date).toLocaleString() },
    { key: "productName", header: "Product" },
    { key: "fromLocationName", header: "From" },
    { key: "toLocationName", header: "To" },
    { key: "quantity", header: "Qty" },
    { key: "movementType", header: "Type", render: (m: InventoryMovement) => (
      <Badge variant={movementColors[m.movementType] as any} className="capitalize text-xs">
        {m.movementType}
      </Badge>
    )},
  ];

  const shipmentColumns = [
    { key: "orderId", header: "Order ID", render: (s: any) => <span className="font-mono text-xs">{s.orderId?.orderNumber || s.orderId}</span> },
    { key: "status", header: "Status", render: (s: any) => (
      <Badge variant={s.status === 'delivered' ? 'default' : 'secondary'}>{s.status}</Badge>
    )},
    { key: "trackingNumber", header: "Tracking" },
    { key: "actions", header: "Actions", render: (s: any) => (
      !['delivered', 'failed'].includes(s.status) && (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => deliverMutation.mutate(s._id)} disabled={deliverMutation.isPending}>
            {deliverMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="mr-1 h-3 w-3" />}
            Mark Delivered
          </Button>
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => failMutation.mutate(s._id)} disabled={failMutation.isPending}>
            {failMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Mark Failed"}
          </Button>
        </div>
      )
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Product Tracking" description="Track product journey and manage shipments" />

      {/* Journey Timeline */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Global Supply Chain Flow</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between max-w-lg mx-auto py-2">
            {journeySteps.map((step, idx) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className={`h-10 w-10 rounded-full ${step.color} flex items-center justify-center`}>
                    <step.icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-[10px] font-medium">{step.label}</span>
                </div>
                {idx < journeySteps.length - 1 && (
                  <div className="h-0.5 w-12 sm:w-20 bg-border mx-2 mt-[-1rem]" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Active & Recent Shipments</CardTitle></CardHeader>
          <CardContent>
            {shipmentsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <DataTable data={shipments || []} columns={shipmentColumns} searchKey="trackingNumber" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Movement History</CardTitle></CardHeader>
          <CardContent>
            {movementsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <DataTable data={movements || []} columns={movementColumns} searchKey="productName" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
