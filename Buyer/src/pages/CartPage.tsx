import { useCartStore } from '@/store';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CouponInput from '@/components/CouponInput';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, total, appliedCoupon } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40" />
        <h2 className="font-heading text-xl font-bold mt-4">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground mt-1">Browse our catalog and add some products!</p>
        <Button asChild className="mt-6">
          <Link to="/">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="font-heading text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {items.map(item => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="h-20 w-20 rounded-lg bg-muted shrink-0 overflow-hidden">
                  <img src={'https://placehold.co/200x200/png?text=' + item.product.name.replace(/ /g, '+')} alt={item.product.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`} className="font-heading font-semibold text-sm hover:text-primary transition-colors">
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.product.sku}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 border border-border rounded-lg">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 text-muted-foreground hover:text-foreground">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-2 text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 text-muted-foreground hover:text-foreground">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-heading font-bold">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.product.id)} className="self-start text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-heading font-semibold">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal().toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-success">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{appliedCoupon.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between font-heading font-bold text-base">
                <span>Total</span>
                <span>₹{total().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading font-semibold text-sm mb-3">Have a coupon?</h3>
            <CouponInput />
          </div>

          <Button asChild size="lg" className="w-full">
            <Link to="/checkout">
              Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
