import { useState } from 'react';
import { useCartStore } from '@/store';
import { orderService } from '@/services';
import { Button } from '@/components/ui/button';
import CouponInput from '@/components/CouponInput';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { items, subtotal, total, appliedCoupon, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: '', street: '', city: '', state: '', pin: '', phone: '' });
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);

  if (items.length === 0 && !orderNumber) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-4"><Link to="/">Browse Products</Link></Button>
      </div>
    );
  }

  const handleConfirm = async () => {
    setLoading(true);
    try {
        const result = await orderService.placeOrder({
            items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
            couponCode: appliedCoupon?.code,
        });
        
        if (result.success) {
            setOrderNumber((result as any).orderNumber || 'ORD-SUCCESS');
            setStep(4);
            clearCart();
            toast.success('Order placed successfully!');
        }
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
        setLoading(false);
    }
  };

  if (step === 4) {
    return (
      <div className="container py-20 text-center max-w-md mx-auto">
        <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto" />
        <h1 className="font-heading text-2xl font-bold mt-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mt-2">Your order <span className="font-mono font-semibold text-foreground">{orderNumber}</span> has been placed.</p>
        <div className="flex gap-3 justify-center mt-6">
          <Button asChild variant="outline"><Link to="/orders">View Orders</Link></Button>
          <Button asChild><Link to="/">Continue Shopping</Link></Button>
        </div>
      </div>
    );
  }

  const steps = ['Delivery Details', 'Order Summary', 'Confirm Order'];

  return (
    <div className="container py-6 max-w-2xl mx-auto">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>
      <h1 className="font-heading text-2xl font-bold mb-6">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
              step > i + 1 ? 'bg-primary text-primary-foreground' : step === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${step >= i + 1 ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-heading font-semibold text-lg">Delivery Address</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { key: 'name', label: 'Full Name', span: 2, placeholder: 'Arjun Mehta' },
                { key: 'street', label: 'Street Address', span: 2, placeholder: '45, Industrial Area Phase 1' },
                { key: 'city', label: 'City', placeholder: 'Mumbai' },
                { key: 'state', label: 'State', placeholder: 'Maharashtra' },
                { key: 'pin', label: 'PIN Code', placeholder: '400001' },
                { key: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
              ].map(field => (
                <div key={field.key} className={field.span === 2 ? 'sm:col-span-2' : ''}>
                  <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
                  <input
                    value={address[field.key as keyof typeof address]}
                    onChange={e => setAddress(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full mt-1 h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
            </div>
            <Button onClick={() => setStep(2)} className="w-full font-bold h-11">Continue to Summary</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-heading font-semibold text-lg">Order Summary</h2>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-heading font-bold pt-2 text-lg">
                <span>Subtotal</span>
                <span>₹{subtotal().toFixed(2)}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground border">
                <span className="font-bold uppercase tracking-widest text-[10px]">Shipping to:</span>
                <p className="mt-1">{address.name}<br/>{address.street}, {address.city}, {address.state} {address.pin}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button onClick={() => setStep(3)} className="flex-1">Apply Coupon</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-heading font-semibold text-lg">Apply Coupon & Confirm</h2>
            <CouponInput />
            <div className="space-y-2 pt-4 border-t border-border text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal().toFixed(2)}</span></div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-medium"><span>Discount Applied</span><span>-₹{appliedCoupon.discount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between font-heading font-bold text-xl pt-3 border-t border-border mt-2"><span>Final Total</span><span>₹{total().toFixed(2)}</span></div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
              <Button onClick={handleConfirm} className="flex-1 font-bold h-11" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Confirm & Place Order'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}