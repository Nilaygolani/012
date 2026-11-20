import React, { useEffect } from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';

export default function WishlistDrawer() {
  const { isOpen, items, openWishlist, closeWishlist, removeItem, toggleItem } = useWishlistStore();

  useEffect(() => {
    const unbindOpen = eventBus.on(EVENTS.OPEN_WISHLIST, openWishlist);
    const unbindToggle = eventBus.on(EVENTS.TOGGLE_WISHLIST, toggleItem);

    return () => {
      unbindOpen?.();
      unbindToggle?.();
    };
  }, []);

  if (!isOpen) return null;

  const handleMoveToBag = (product) => {
    eventBus.emit(EVENTS.ADD_TO_CART, {
      ...product,
      selectedSize: product.sizes?.[0] || 'M',
      quantity: 1
    });
    removeItem(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={closeWishlist} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10 animate-slideLeft">
          <div className="p-4 sm:p-5 border-b border-brand-border flex items-center justify-between bg-brand-bg/60">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-primary fill-current" />
              <h3 className="font-serif text-lg font-semibold text-brand-dark uppercase tracking-wider">
                My Wishlist ({items.length})
              </h3>
            </div>
            <button
              onClick={closeWishlist}
              className="p-1.5 text-brand-dark/70 hover:text-brand-dark rounded-full hover:bg-brand-sand/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-brand-sand/60 text-brand-muted flex items-center justify-center">
                  <Heart className="w-7 h-7 stroke-1" />
                </div>
                <h4 className="font-serif text-xl font-medium text-brand-dark">
                  Your wishlist is empty
                </h4>
                <p className="text-xs text-brand-muted max-w-xs">
                  Save your favorite styles by tapping the heart icon on any design.
                </p>
                <button
                  onClick={() => {
                    closeWishlist();
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-2 bg-brand-primary text-white text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-full hover:bg-brand-primaryDark transition-all"
                >
                  Browse Designs
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-xl border border-brand-border/60 bg-white hover:border-brand-primary/30 transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover object-top rounded-lg bg-brand-sand/40 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h5 className="font-serif text-sm font-medium text-brand-dark line-clamp-1">
                          {item.name}
                        </h5>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-brand-muted hover:text-red-500 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-brand-muted mt-0.5">{item.category}</div>
                      <div className="text-sm font-bold text-brand-dark mt-1">
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => handleMoveToBag(item)}
                      className="w-full mt-2 py-1.5 bg-brand-dark hover:bg-brand-primary text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

