import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { locationService } from "@/services/locationService";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Location, LocationType } from "@/types";

export default function LocationsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<LocationType>("warehouse");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const { data: locations, isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: locationService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: locationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast({ title: "Location Created", description: "New location added successfully." });
      setCreateOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Failed to create location", 
        variant: "destructive" 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => locationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast({ title: "Location Updated", description: "Location details modified successfully." });
      setEditOpen(false);
      setEditingLocation(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: "Update Failed", 
        description: error.response?.data?.message || "Failed to update location", 
        variant: "destructive" 
      });
    }
  });

  const resetForm = () => {
    setName("");
    setType("warehouse");
    setAddress("");
    setLat("");
    setLng("");
  };

  const handleCreate = () => {
    if (!name || !address || !lat || !lng) {
      toast({ title: "Validation Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    createMutation.mutate({
      name,
      type,
      address,
      coordinates: {
        lat: parseFloat(lat),
        lng: Number(lng)
      }
    });
  };

  const handleUpdate = () => {
    if (!editingLocation || !name || !address || !lat || !lng) return;
    updateMutation.mutate({
      id: editingLocation.id,
      data: {
        name,
        type,
        address,
        coordinates: {
          lat: parseFloat(lat),
          lng: Number(lng)
        }
      }
    });
  };

  const openEdit = (l: Location) => {
    setEditingLocation(l);
    setName(l.name);
    setType(l.type);
    setAddress(l.address);
    setLat(l.coordinates?.lat.toString() || "");
    setLng(l.coordinates?.lng.toString() || "");
    setEditOpen(true);
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "type", header: "Type", render: (l: Location) => (
      <Badge variant="outline" className="capitalize">{l.type}</Badge>
    )},
    { key: "address", header: "Address" },
    { key: "coordinates", header: "Coordinates", render: (l: Location) => (
      <span className="text-xs text-muted-foreground">
        {l.coordinates?.lat}, {l.coordinates?.lng}
      </span>
    )},
    { key: "actions", header: "Actions", render: (l: Location) => (
      <Button variant="ghost" size="sm" onClick={() => openEdit(l)}>
        Edit
      </Button>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Location Management" description="Manage factories, warehouses, and dealers">
        <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Location</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New Location</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Location Name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v: LocationType) => setType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="factory">Factory</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="dealer">Dealer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input placeholder="Full Address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input type="number" step="any" placeholder="37.7749" value={lat} onChange={(e) => setLat(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input type="number" step="any" placeholder="-122.4194" value={lng} onChange={(e) => setLng(e.target.value)} />
                </div>
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Location
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) { setEditingLocation(null); resetForm(); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Location</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v: LocationType) => setType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="factory">Factory</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="dealer">Dealer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} />
              </div>
            </div>
            <Button className="w-full" onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable data={locations || []} columns={columns} searchKey="name" searchPlaceholder="Search locations..." />
      )}
    </div>
  );
}
