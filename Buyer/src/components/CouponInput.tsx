import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';
import { couponService } from '@/services';
import { useCartStore } from '@/store';

export default function CouponInput() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { subtotal, setAppliedCoupon } = useCartStore();

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    const result = await couponService.applyCoupon(code.trim(), subtotal());
    setMessage(result.message);
    setIsError(!result.valid);
    if (result.valid) {
      setAppliedCoupon({ code: code.trim(), discount: result.discount });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Enter coupon code"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            className="w-full h-10 rounded-lg border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button onClick={handleApply} disabled={loading || !code.trim()} variant="outline">
          {loading ? 'Applying...' : 'Apply'}
        </Button>
      </div>
      {message && (
        <p className={`text-xs ${isError ? 'text-destructive' : 'text-success'}`}>{message}</p>
      )}
    </div>
  );
}
