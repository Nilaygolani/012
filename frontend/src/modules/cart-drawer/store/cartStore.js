import { create } from 'zustand';
import { eventBus } from '../../../core/eventBus/bus';

export const useCartStore = create((set, get) => ({
  isOpen: false,
  items: [],
  coupon: null,
  discountRate: 0,
  lastConfirmedOrder: null,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  addItem: (product) => {
    const { items } = get();
    const existingIndex = items.findIndex(
      (i) => i.id === product.id && i.selectedSize === product.selectedSize
    );

    let updated;
    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex].quantity += product.quantity || 1;
    } else {
      updated = [...items, { ...product, quantity: product.quantity || 1 }];
    }

    set({ items: updated, isOpen: true });
    const count = updated.reduce((sum, item) => sum + item.quantity, 0);
    eventBus.emit('cart:update_count', count);
  },

  updateQuantity: (index, delta) => {
    const { items } = get();
    const updated = items
      .map((item, idx) => {
        if (idx === index) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    set({ items: updated });
    const count = updated.reduce((sum, item) => sum + item.quantity, 0);
    eventBus.emit('cart:update_count', count);
  },

  removeItem: (index) => {
    const { items } = get();
    const updated = items.filter((_, idx) => idx !== index);
    set({ items: updated });
    const count = updated.reduce((sum, item) => sum + item.quantity, 0);
    eventBus.emit('cart:update_count', count);
  },

  applyCoupon: (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'NAIL15' || clean === 'FIRST10' || clean === 'FREESHIP') {
      const rate = clean === 'NAIL15' ? 0.15 : 0.10;
      set({ coupon: clean, discountRate: rate });
      return { success: true, message: `Coupon ${clean} applied (${rate * 100}% Off)!` };
    }
    return { success: false, message: 'Invalid coupon code.' };
  },

  removeCoupon: () => set({ coupon: null, discountRate: 0 }),

  clearCart: (order) => {
    set({ items: [], lastConfirmedOrder: order });
    eventBus.emit('cart:update_count', 0);
  }
}));

