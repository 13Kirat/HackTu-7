import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { movements } from "@/mock/data";
import type { InventoryMovement } from "@/types";
import { Factory, Warehouse, Store, User } from "lucide-react";

const journeySteps = [
  { label: "Factory", icon: Factory, color: "bg-chart-1" },
  { label: "Warehouse", icon: Warehouse, color: "bg-chart-2" },
  { label: "Dealer", icon: Store, color: "bg-chart-3" },
  { label: "Customer", icon: User, color: "bg-chart-4" },
];

const movementColors: Record<string, string> = {
  transfer: "default",
  shipment: "secondary",
  return: "destructive",
  restock: "outline",
};

const columns = [
  { key: "date", header: "Date", render: (m: InventoryMovement) => new Date(m.date).toLocaleDateString() },
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

export default function ProductTracking() {
  return (
    <div className="space-y-6">
      <PageHeader title="Product Tracking" description="Track product journey across the supply chain" />

      {/* Journey Timeline */}
      <Card>
        <CardHeader><CardTitle className="text-base">Product Journey</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between max-w-lg mx-auto py-4">
            {journeySteps.map((step, idx) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className={`h-12 w-12 rounded-full ${step.color} flex items-center justify-center`}>
                    <step.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-medium">{step.label}</span>
                </div>
                {idx < journeySteps.length - 1 && (
                  <div className="h-0.5 w-12 sm:w-20 bg-border mx-2 mt-[-1.5rem]" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Movement History */}
      <DataTable data={movements} columns={columns} searchKey="productName" searchPlaceholder="Search movements..." />
    </div>
  );
}
