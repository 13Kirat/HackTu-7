import { Product } from '@/types';
import { useCartStore } from '@/store';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const statusColors = {
  in_stock: 'bg-success/10 text-success',
  limited_stock: 'bg-warning/10 text-warning',
  out_of_stock: 'bg-destructive/10 text-destructive',
};

const statusLabels = {
  in_stock: 'In Stock',
  limited_stock: 'Limited Stock',
  out_of_stock: 'Out of Stock',
};

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
}

export default function ProductCard({ product, view = 'grid' }: ProductCardProps) {
  const addItem = useCartStore(s => s.addItem);

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
      >
        <Link to={`/product/${product.id}`} className="shrink-0">
          <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-heading font-semibold text-sm truncate hover:text-primary transition-colors">{product.name}</h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">SKU: {product.sku}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-heading font-bold text-lg">₹{product.price.toFixed(2)}</span>
            <Badge variant="outline" className={`text-[10px] ${statusColors[product.availability]}`}>
              {statusLabels[product.availability]}
            </Badge>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => addItem(product)}
          disabled={product.availability === 'out_of_stock'}
          className="shrink-0 self-center"
        >
          <ShoppingCart className="h-4 w-4 mr-1" /> Add
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden relative">
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <Badge variant="outline" className={`absolute top-3 right-3 text-[10px] backdrop-blur-sm ${statusColors[product.availability]}`}>
            {statusLabels[product.availability]}
          </Badge>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-heading font-semibold text-sm truncate hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">SKU: {product.sku}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-heading font-bold text-lg">₹{product.price.toFixed(2)}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addItem(product)}
            disabled={product.availability === 'out_of_stock'}
            className="h-8"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
