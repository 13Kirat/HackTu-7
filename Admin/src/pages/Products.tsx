import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Edit2, Trash2 } from "lucide-react";
import type { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [finish, setFinish] = useState("");
  const [size, setSize] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product Created", description: "New product added to catalog." });
      setCreateOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to create product", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product Updated", description: "Product details modified successfully." });
      setEditOpen(false);
      setEditingProduct(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to update product", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product Deleted", description: "Product removed from catalog." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to delete product", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setName(""); setSku(""); setCategory(""); setColor(""); setFinish(""); setSize(""); setBasePrice(""); setCostPrice("");
  };

  const handleCreate = () => {
    if (!name || !sku || !category || !basePrice) {
        toast({ title: "Validation Error", description: "Please fill in all required fields", variant: "destructive" });
        return;
    }
    createMutation.mutate({
      name, sku, category,
      price: Number(basePrice),
      costPrice: Number(costPrice) || 0,
      attributes: { color, finish, size }
    });
  };

  const handleUpdate = () => {
    if (!editingProduct) return;
    updateMutation.mutate({
      id: editingProduct.id,
      data: {
        name, sku, category,
        price: Number(basePrice),
        costPrice: Number(costPrice) || 0,
        attributes: { color, finish, size }
      }
    });
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setSku(product.sku);
    setCategory(product.category);
    setBasePrice(String(product.basePrice));
    setCostPrice(String(product.costPrice || "0"));
    
    // Attributes handling
    if (product.attributes) {
        setColor(product.attributes.color || "");
        setFinish(product.attributes.finish || "");
        setSize(product.attributes.size || "");
    } else {
        setColor(product.color || "");
        setFinish(product.finish || "");
        setSize(product.size || "");
    }
    
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
              <SelectItem value="Hardware">Hardware</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Color</Label><Input placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2"><Label>Finish</Label><Input placeholder="Finish" value={finish} onChange={(e) => setFinish(e.target.value)} /></div>
        <div className="space-y-2"><Label>Size</Label><Input placeholder="60x60cm" value={size} onChange={(e) => setSize(e.target.value)} /></div>
        <div className="space-y-2"><Label>Price</Label><Input type="number" placeholder="0" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} /></div>
      </div>
      <div className="space-y-2"><Label>Cost Price (Internal)</Label><Input type="number" placeholder="0" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} /></div>
    </>
  );

  const columns = [
    { key: "name", header: "Name" },
    { key: "sku", header: "SKU", render: (p: Product) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{p.sku}</code> },
    { key: "category", header: "Category" },
    { key: "basePrice", header: "Price", render: (p: Product) => `$${p.basePrice}` },
    { key: "actions", header: "Actions", render: (p: Product) => (
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Edit2 className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => {
            if(confirm("Delete this product?")) deleteMutation.mutate(p.id);
        }}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
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
              <Button className="w-full" onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) { setEditingProduct(null); resetForm(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <FormFields />
            <Button className="w-full" onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {productsLoading ? (
        <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <DataTable data={products || []} columns={columns} searchKey="name" searchPlaceholder="Search products..." />
      )}
    </div>
  );
}
