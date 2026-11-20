import { create } from 'zustand';
import { eventBus } from '../../../core/eventBus/bus';

export const useWishlistStore = create((set, get) => ({
  isOpen: false,
  items: [],

  openWishlist: () => set({ isOpen: true }),
  closeWishlist: () => set({ isOpen: false }),

  toggleItem: (product) => {
    const { items } = get();
    const exists = items.some((i) => i.id === product.id);
    let updated;
    if (exists) {
      updated = items.filter((i) => i.id !== product.id);
    } else {
      updated = [...items, product];
    }
    set({ items: updated });
    eventBus.emit('wishlist:update_count', updated.length);
  },

  removeItem: (id) => {
    const { items } = get();
    const updated = items.filter((i) => i.id !== id);
    set({ items: updated });
    eventBus.emit('wishlist:update_count', updated.length);
  }
}));

