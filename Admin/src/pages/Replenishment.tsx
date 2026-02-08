import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiService } from "@/services/aiService";
import { locationService } from "@/services/locationService";
import { shipmentService } from "@/services/shipmentService";
import { orderService } from "@/services/orderService";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { Card } from "@/components/ui/card";

export default function Replenishment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  
  // Form state
  const [fromLoc, setFromLoc] = useState("");
  const [qty, setQty] = useState("");

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: locationService.getAll,
  });

  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ["replenishment", selectedLocation],
    queryFn: () => aiService.getReplenishment(selectedLocation),
    enabled: !!selectedLocation,
  });

  const replenishmentMutation = useMutation({
    mutationFn: async (payload: any) => {
      const order = await orderService.createDealerOrder({
        fromLocationId: payload.fromLoc,
        toLocationId: selectedLocation,
        items: [{ productId: payload.productId, quantity: payload.quantity }]
      });
      return await shipmentService.create({ orderId: order._id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["replenishment"] });
      toast({ title: "Transfer Initiated", description: "Replenishment shipment has been created." });
      setTransferOpen(false);
      setSelectedItem(null);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to initiate transfer", variant: "destructive" });
    }
  });

  const openTransfer = (item: any) => {
    setSelectedItem(item);
    setQty(String(item.recommendedRestock));
    setFromLoc("");
    setTransferOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (!fromLoc || !qty) return;
    replenishmentMutation.mutate({ 
      fromLoc, 
      productId: selectedItem.productId, 
      quantity: Number(qty) 
    });
  };

  const columns = [
    { key: "productName", header: "Product" },
    { key: "sku", header: "SKU" },
    { key: "availableStock", header: "Available" },
    { key: "predictedDemand", header: "Predicted Demand" },
    { key: "recommendedRestock", header: "Recommended Qty", render: (f: any) => (
      <Badge variant="outline" className="font-mono">{f.recommendedRestock}</Badge>
    )},
    { key: "priority", header: "Priority", render: (f: any) => (
      <Badge variant={f.priority === 'high' ? 'destructive' : 'secondary'} className="capitalize">{f.priority}</Badge>
    )},
    { key: "action", header: "Action", render: (f: any) => (
      <Button size="sm" variant="outline" onClick={() => openTransfer(f)}>
        <ArrowLeftRight className="mr-1 h-3 w-3" />Initiate
      </Button>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Stock Replenishment" description="AI-driven restock recommendations for dealer locations" />

      <div className="flex items-center gap-4">
        <div className="w-64">
          <Label className="text-xs mb-1.5 block">Select Destination Location</Label>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
            <SelectContent>
              {locations?.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" className="mt-6" onClick={() => refetch()} disabled={!selectedLocation || isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {!selectedLocation ? (
        <Card className="p-10 text-center border-dashed">
          <p className="text-muted-foreground">Select a location to view AI replenishment recommendations.</p>
        </Card>
      ) : isLoading ? (
        <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <DataTable 
          data={recommendations?.recommendations || []} 
          columns={columns} 
          searchKey="productName" 
          searchPlaceholder="Search products..." 
        />
      )}

      {/* Transfer Dialog */}
      <Dialog open={transferOpen} onOpenChange={(open) => { setTransferOpen(open); if (!open) setSelectedItem(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Initiate Replenishment — {selectedItem?.productName}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Source (Ship From)</Label>
              <Select value={fromLoc} onValueChange={setFromLoc}>
                <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                <SelectContent>
                  {locations?.filter(l => l.id !== selectedLocation && l.type !== 'dealer').map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Restock Quantity</Label>
              <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleConfirmTransfer} disabled={replenishmentMutation.isPending}>
              {replenishmentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm & Ship
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}