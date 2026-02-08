import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Edit2, Trash2 } from "lucide-react";
import type { Coupon } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<string>("percentage");
  const [value, setValue] = useState("");
  const [validTo, setValidTo] = useState("");

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: productService.getCoupons,
  });

  const createMutation = useMutation({
    mutationFn: productService.createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast({ title: "Coupon Created", description: "New promotion code added." });
      setCreateOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to create coupon", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => productService.updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast({ title: "Coupon Updated", description: "Coupon details modified." });
      setEditOpen(false);
      setEditingCoupon(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to update coupon", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast({ title: "Coupon Deleted", description: "Promotion removed successfully." });
    },
  });

  const resetForm = () => {
    setCode(""); setDiscountType("percentage"); setValue(""); setValidTo("");
  };

  const handleCreate = () => {
    if (!code || !value) return;
    createMutation.mutate({ 
        code: code.toUpperCase(), 
        discountType, 
        discountValue: Number(value), 
        validUntil: validTo || undefined 
    });
  };

  const handleUpdate = () => {
    if (!editingCoupon) return;
    updateMutation.mutate({
      id: editingCoupon.id,
      data: { 
          code: code.toUpperCase(), 
          discountType, 
          discountValue: Number(value), 
          validUntil: validTo || undefined 
      }
    });
  };

  const openEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDiscountType(coupon.discountType);
    setValue(String(coupon.value));
    if (coupon.validTo) {
        setValidTo(new Date(coupon.validTo).toISOString().split('T')[0]);
    }
    setEditOpen(true);
  };

  const toggleActive = (coupon: Coupon) => {
    updateMutation.mutate({
        id: coupon.id,
        data: { isActive: !coupon.active }
    });
  };

  const FormFields = () => (
    <>
      <div className="space-y-2"><Label>Code</Label><Input placeholder="e.g. SAVE20" value={code} onChange={(e) => setCode(e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Discount Type</Label>
          <Select value={discountType} onValueChange={setDiscountType}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Value</Label><Input type="number" placeholder="0" value={value} onChange={(e) => setValue(e.target.value)} /></div>
      </div>
      <div className="space-y-2"><Label>Valid Until</Label><Input type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} /></div>
    </>
  );

  const columns = [
    { key: "code", header: "Code", render: (c: Coupon) => <code className="text-xs font-bold bg-muted px-2 py-1 rounded">{c.code}</code> },
    { key: "discountType", header: "Type", render: (c: Coupon) => <span className="capitalize">{c.discountType}</span> },
    { key: "value", header: "Value", render: (c: Coupon) => c.discountType === "percentage" ? `${c.value}%` : `₹${c.value}` },
    { key: "validTo", header: "Expires", render: (c: Coupon) => c.validTo ? new Date(c.validTo).toLocaleDateString() : "—" },
    { key: "active", header: "Status", render: (c: Coupon) => (
      <Badge variant={c.active ? "default" : "secondary"} className="cursor-pointer" onClick={() => toggleActive(c)}>
        {c.active ? "Active" : "Inactive"}
      </Badge>
    )},
    { key: "actions", header: "Actions", render: (c: Coupon) => (
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Edit2 className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => {
            if(confirm("Delete this coupon?")) deleteMutation.mutate(c.id);
        }}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Coupon Management" description="Manage discount coupons and promotions">
        <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Coupon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Coupon</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <FormFields />
              <Button className="w-full" onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Coupon
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) { setEditingCoupon(null); resetForm(); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Coupon</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <FormFields />
            <Button className="w-full" onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <DataTable data={coupons || []} columns={columns} searchKey="code" searchPlaceholder="Search coupons..." />
      )}
    </div>
  );
}