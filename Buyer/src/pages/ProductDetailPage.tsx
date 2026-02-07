import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService, couponService } from '@/services';
import { Product, Dealer, Coupon } from '@/types';
import { useCartStore } from '@/store';
import { ShoppingCart, MapPin, Truck, Tag, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const statusConfig = {
  in_stock: { label: 'In Stock', className: 'bg-success/10 text-success border-success/20' },
  limited_stock: { label: 'Limited Stock', className: 'bg-warning/10 text-warning border-warning/20' },
  out_of_stock: { label: 'Out of Stock', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    if (!id) return;
    productService.getProduct(id).then(p => setProduct(p || null));
    productService.getDealers(id).then(setDealers);
    couponService.getCoupons().then(setCoupons);
  }, [id]);

  if (!product) return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;

  const status = statusConfig[product.availability];

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="container py-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center overflow-hidden border border-border">
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className={status.className}>{status.label}</Badge>
            <h1 className="font-heading text-3xl font-bold mt-2">{product.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
          </div>

          <p className="font-heading text-3xl font-bold text-primary">₹{product.price.toFixed(2)}</p>

          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Finish', product.finish],
              ['Color', product.color],
              ['Size', product.size],
              ['Stock', `${product.stockCount} units`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Delivery */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 text-primary" />
            Estimated delivery: {product.estimatedDelivery}
          </div>

          {/* Add to cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground">−</button>
              <span className="px-3 py-2 min-w-[3rem] text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-muted-foreground hover:text-foreground">+</button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={product.availability === 'out_of_stock'}
              className="flex-1"
              size="lg"
            >
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
          </div>

          {/* Dealers */}
          <div>
            <h3 className="font-heading font-semibold text-sm flex items-center gap-1.5 mb-3">
              <MapPin className="h-4 w-4 text-primary" /> Nearest Dealers
            </h3>
            <div className="space-y-2">
              {dealers.map(d => (
                <div key={d.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                  <div>
                    <p className="font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.location} · {d.distance}</p>
                  </div>
                  <Badge variant="outline">{d.stock} in stock</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Coupons */}
          <div>
            <h3 className="font-heading font-semibold text-sm flex items-center gap-1.5 mb-3">
              <Tag className="h-4 w-4 text-accent" /> Available Coupons
            </h3>
            <div className="space-y-2">
              {coupons.filter(c => c.active).map(c => (
                <div key={c.id} className="flex items-center gap-3 rounded-lg border border-dashed border-accent/40 bg-accent/5 p-3 text-sm">
                  <Check className="h-4 w-4 text-accent shrink-0" />
                  <div>
                    <span className="font-mono font-semibold text-accent">{c.code}</span>
                    <span className="text-muted-foreground ml-2">{c.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
