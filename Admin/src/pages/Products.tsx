import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { products as initialProducts } from "@/mock/data";
import type { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

export default function ProductsPage() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [finish, setFinish] = useState("");
  const [size, setSize] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const resetForm = () => { setName(""); setSku(""); setCategory(""); setColor(""); setFinish(""); setSize(""); setBasePrice(""); };

  const handleCreate = () => {
    if (!name || !sku || !category) {
      toast({ title: "Validation Error", description: "Name, SKU, and Category are required", variant: "destructive" });
      return;
    }
    const newProduct: Product = { id: `p${Date.now()}`, name, sku, category, color, finish, size, basePrice: Number(basePrice) || 0 };
    setProductList((prev) => [...prev, newProduct]);
    toast({ title: "Product Created", description: `${name} has been added.` });
    addNotification({ type: "success", title: "Product Created", message: `${name} (${sku}) added to catalog` });
    setCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editProduct || !name || !sku) return;
    setProductList((prev) => prev.map((p) => p.id === editProduct.id ? { ...p, name, sku, category, color, finish, size, basePrice: Number(basePrice) || 0 } : p));
    toast({ title: "Product Updated", description: `${name} has been updated.` });
    addNotification({ type: "info", title: "Product Updated", message: `${name} details modified` });
    setEditOpen(false);
    setEditProduct(null);
    resetForm();
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setName(product.name); setSku(product.sku); setCategory(product.category);
    setColor(product.color); setFinish(product.finish); setSize(product.size);
    setBasePrice(String(product.basePrice));
    setEditOpen(true);
  };

  const FormFields = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Name</Label><Input placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="space-y-2"><Label>SKU</Label><Input placeholder="SKU-001" value={sku} onChange={(e) => setSku(e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Tiles">Tiles</SelectItem>
              <SelectItem value="Flooring">Flooring</SelectItem>
              <SelectItem value="Slabs">Slabs</SelectItem>
              <SelectItem value="Countertops">Countertops</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Color</Label><Input placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2"><Label>Finish</Label><Input placeholder="Finish" value={finish} onChange={(e) => setFinish(e.target.value)} /></div>
        <div className="space-y-2"><Label>Size</Label><Input placeholder="60x60cm" value={size} onChange={(e) => setSize(e.target.value)} /></div>
        <div className="space-y-2"><Label>Base Price</Label><Input type="number" placeholder="0" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} /></div>
      </div>
    </>
  );

  const columns = [
    { key: "name", header: "Name" },
    { key: "sku", header: "SKU", render: (p: Product) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{p.sku}</code> },
    { key: "category", header: "Category" },
    { key: "color", header: "Color" },
    { key: "finish", header: "Finish" },
    { key: "size", header: "Size" },
    { key: "basePrice", header: "Price", render: (p: Product) => `$${p.basePrice}` },
    { key: "actions", header: "", render: (p: Product) => <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>Edit</Button> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Product Management" description="Manage your product catalog">
        <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Product</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <FormFields />
              <Button className="w-full" onClick={handleCreate}>Create Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) { setEditProduct(null); resetForm(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <FormFields />
            <Button className="w-full" onClick={handleEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <DataTable data={productList} columns={columns} searchKey="name" searchPlaceholder="Search products..." />
    </div>
  );
}
