import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { coupons as initialCoupons } from "@/mock/data";
import type { Coupon } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

export default function CouponsPage() {
  const [couponList, setCouponList] = useState<Coupon[]>(initialCoupons);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<string>("");
  const [value, setValue] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const resetForm = () => { setCode(""); setDiscountType(""); setValue(""); setValidFrom(""); setValidTo(""); };

  const handleCreate = () => {
    if (!code || !discountType || !value) {
      toast({ title: "Validation Error", description: "Code, type, and value are required", variant: "destructive" });
      return;
    }
    const newCoupon: Coupon = {
      id: `c${Date.now()}`, code: code.toUpperCase(), discountType: discountType as Coupon["discountType"],
      value: Number(value), validFrom, validTo, applicableProducts: [], active: true,
    };
    setCouponList((prev) => [...prev, newCoupon]);
    toast({ title: "Coupon Created", description: `${code.toUpperCase()} has been added.` });
    addNotification({ type: "success", title: "Coupon Created", message: `Coupon ${code.toUpperCase()} is now active` });
    setCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editCoupon || !code || !discountType) return;
    setCouponList((prev) => prev.map((c) => c.id === editCoupon.id ? {
      ...c, code: code.toUpperCase(), discountType: discountType as Coupon["discountType"],
      value: Number(value), validFrom, validTo,
    } : c));
    toast({ title: "Coupon Updated", description: `${code.toUpperCase()} has been updated.` });
    addNotification({ type: "info", title: "Coupon Updated", message: `${code.toUpperCase()} details modified` });
    setEditOpen(false);
    setEditCoupon(null);
    resetForm();
  };

  const openEdit = (coupon: Coupon) => {
    setEditCoupon(coupon);
    setCode(coupon.code); setDiscountType(coupon.discountType);
    setValue(String(coupon.value)); setValidFrom(coupon.validFrom); setValidTo(coupon.validTo);
    setEditOpen(true);
  };

  const toggleActive = (coupon: Coupon) => {
    setCouponList((prev) => prev.map((c) => c.id === coupon.id ? { ...c, active: !c.active } : c));
    toast({ title: coupon.active ? "Coupon Deactivated" : "Coupon Activated" });
  };

  const FormFields = () => (
    <>
      <div className="space-y-2"><Label>Code</Label><Input placeholder="e.g. SAVE20" value={code} onChange={(e) => setCode(e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Discount Type</Label>
          <Select value={discountType} onValueChange={setDiscountType}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Value</Label><Input type="number" placeholder="0" value={value} onChange={(e) => setValue(e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Valid From</Label><Input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} /></div>
        <div className="space-y-2"><Label>Valid To</Label><Input type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} /></div>
      </div>
    </>
  );

  const columns = [
    { key: "code", header: "Code", render: (c: Coupon) => <code className="text-xs font-bold bg-muted px-2 py-1 rounded">{c.code}</code> },
    { key: "discountType", header: "Type", render: (c: Coupon) => <span className="capitalize">{c.discountType}</span> },
    { key: "value", header: "Value", render: (c: Coupon) => c.discountType === "percentage" ? `${c.value}%` : `$${c.value}` },
    { key: "validFrom", header: "Valid From", render: (c: Coupon) => c.validFrom ? new Date(c.validFrom).toLocaleDateString() : "—" },
    { key: "validTo", header: "Valid To", render: (c: Coupon) => c.validTo ? new Date(c.validTo).toLocaleDateString() : "—" },
    { key: "active", header: "Status", render: (c: Coupon) => (
      <Badge variant={c.active ? "default" : "secondary"} className="cursor-pointer" onClick={() => toggleActive(c)}>
        {c.active ? "Active" : "Inactive"}
      </Badge>
    )},
    { key: "actions", header: "", render: (c: Coupon) => <Button size="sm" variant="ghost" onClick={() => openEdit(c)}>Edit</Button> },
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
              <Button className="w-full" onClick={handleCreate}>Create Coupon</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) { setEditCoupon(null); resetForm(); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Coupon</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <FormFields />
            <Button className="w-full" onClick={handleEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <DataTable data={couponList} columns={columns} searchKey="code" searchPlaceholder="Search coupons..." />
    </div>
  );
}
