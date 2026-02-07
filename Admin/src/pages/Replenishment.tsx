import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { forecasts } from "@/mock/data";
import { locations } from "@/mock/data";
import type { Forecast } from "@/types";
import { ArrowLeftRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

const replenishmentData = forecasts.filter((f) => f.recommendedReplenishment > 0);

export default function Replenishment() {
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Forecast | null>(null);
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [qty, setQty] = useState("");
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const openTransfer = (item: Forecast) => {
    setSelectedItem(item);
    setToLoc(item.locationId);
    setQty(String(item.recommendedReplenishment));
    setFromLoc("");
    setTransferOpen(true);
  };

  const handleTransfer = () => {
    if (!fromLoc || !toLoc || !qty) {
      toast({ title: "Validation Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    toast({ title: "Transfer Created", description: `${qty} units of ${selectedItem?.productName} transfer initiated.` });
    addNotification({ type: "success", title: "Replenishment Transfer", message: `${qty} units of ${selectedItem?.productName} transfer initiated` });
    setTransferOpen(false);
    setSelectedItem(null);
  };

  const columns = [
    { key: "productName", header: "Product" },
    { key: "locationName", header: "Location" },
    { key: "currentStock", header: "Current Stock" },
    { key: "predictedDemand", header: "Predicted Demand" },
    { key: "recommendedReplenishment", header: "Recommended Qty", render: (f: Forecast) => (
      <Badge variant="outline" className="font-mono">{f.recommendedReplenishment}</Badge>
    )},
    { key: "action", header: "Action", render: (f: Forecast) => (
      <Button size="sm" variant="outline" onClick={() => openTransfer(f)}>
        <ArrowLeftRight className="mr-1 h-3 w-3" />Create Transfer
      </Button>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Stock Replenishment" description="Recommended stock replenishment based on forecasts" />

      {/* Transfer Dialog */}
      <Dialog open={transferOpen} onOpenChange={(open) => { setTransferOpen(open); if (!open) setSelectedItem(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Transfer — {selectedItem?.productName}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>From Location</Label>
              <Select value={fromLoc} onValueChange={setFromLoc}>
                <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                <SelectContent>{locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>To Location</Label>
              <Select value={toLoc} onValueChange={setToLoc}>
                <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                <SelectContent>{locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleTransfer}>Confirm Transfer</Button>
          </div>
        </DialogContent>
      </Dialog>

      <DataTable data={replenishmentData} columns={columns} searchKey="productName" searchPlaceholder="Search..." />
    </div>
  );
}
