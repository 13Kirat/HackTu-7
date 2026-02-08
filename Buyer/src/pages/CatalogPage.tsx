import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { productService } from "@/services";
import { mockCategories, mockColors, mockFinishes } from "@/mock/data";
import ProductCard from "@/components/ProductCard";
import { LayoutGrid, List, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function CatalogPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [finish, setFinish] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const { data: products, isLoading } = useQuery({
    queryKey: ['buyer-products', category, color, finish, search, priceRange],
    queryFn: () => productService.getProducts({
        category: category || undefined,
        color: color || undefined,
        finish: finish || undefined,
        search: search || undefined,
        priceRange: priceRange[0] > 0 || priceRange[1] < 5000 ? priceRange : undefined,
    })
  });

  const clearFilters = () => { setCategory(''); setColor(''); setFinish(''); setPriceRange([0, 5000]); };
  const hasFilters = category || color || finish || priceRange[0] > 0 || priceRange[1] < 5000;

  const FilterPanel = () => (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="mt-1.5"><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All Categories</SelectItem>
            {mockCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Color</label>
        <Select value={color} onValueChange={setColor}>
          <SelectTrigger className="mt-1.5"><SelectValue placeholder="All colors" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All Colors</SelectItem>
            {mockColors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Finish</label>
        <Select value={finish} onValueChange={setFinish}>
          <SelectTrigger className="mt-1.5"><SelectValue placeholder="All finishes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All Finishes</SelectItem>
            {mockFinishes.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Price Range</label>
        <Slider
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          min={0}
          max={5000}
          step={100}
          className="mt-3"
        />
        <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
          <X className="h-3 w-3 mr-1" /> Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Product Catalog</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading ? "Loading..." : `${products?.length || 0} products available ${search ? `matching "${search}"` : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
              <div className="mt-4"><FilterPanel /></div>
            </SheetContent>
          </Sheet>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Filters */}
        <aside className="hidden md:block w-60 shrink-0">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-4">
            <h3 className="font-heading font-semibold text-sm mb-4">Filters</h3>
            <FilterPanel />
          </div>
        </aside>

        {/* Products */}
        <main className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Fetching catalog...</p>
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="font-heading font-semibold text-lg">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p: any) => <ProductCard key={p.id} product={p} view="grid" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((p: any) => <ProductCard key={p.id} product={p} view="list" />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}