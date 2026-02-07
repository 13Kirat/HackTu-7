import { create } from 'zustand';
import { CartItem, Product, Alert } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: { code: string; discount: number } | null;
  setAppliedCoupon: (coupon: { code: string; discount: number } | null) => void;
  subtotal: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  appliedCoupon: null,
  addItem: (product, quantity = 1) => set(state => {
    const existing = state.items.find(i => i.product.id === product.id);
    if (existing) {
      return { items: state.items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i) };
    }
    return { items: [...state.items, { product, quantity }] };
  }),
  removeItem: (productId) => set(state => ({ items: state.items.filter(i => i.product.id !== productId) })),
  updateQuantity: (productId, quantity) => set(state => ({
    items: quantity <= 0
      ? state.items.filter(i => i.product.id !== productId)
      : state.items.map(i => i.product.id === productId ? { ...i, quantity } : i),
  })),
  clearCart: () => set({ items: [], appliedCoupon: null }),
  setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
  subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  total: () => {
    const sub = get().subtotal();
    const discount = get().appliedCoupon?.discount || 0;
    return Math.max(0, sub - discount);
  },
}));

interface UIStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  unreadCount: () => number;
}

export const useUIStore = create<UIStore>((set, get) => ({
  theme: 'light',
  toggleTheme: () => set(state => {
    const next = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', next === 'dark');
    return { theme: next };
  }),
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
  unreadCount: () => get().alerts.filter(a => !a.read).length,
}));
