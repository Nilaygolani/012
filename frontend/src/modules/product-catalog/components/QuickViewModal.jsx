import React, { useState, useEffect, useRef } from 'react';
import { X, Star, ShoppingBag, Truck, RefreshCw } from 'lucide-react';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';

export default function QuickViewModal() {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const quickGalleryRef = useRef(null);

  useEffect(() => {
    const unbind = eventBus.on(EVENTS.OPEN_QUICK_VIEW, (item) => {
      setProduct(item);
      setSelectedSize(item.sizes?.[0] || 'M');
      setQuantity(1);
      setActiveImage(item.image);
      setActiveImageIndex(0);
      setTimeout(() => {
        quickGalleryRef.current?.scrollTo({ left: 0 });
      }, 50);
    });

    return () => unbind?.();
  }, []);

  if (!product) return null;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.inStock === false || (product.stock !== undefined && product.stock <= 0);
  const isSelectedSizeOutOfStock = (product.outOfStockSizes || []).includes(selectedSize);

  const galleryImages = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : [product.image, product.hoverImage].filter(Boolean);

  const scrollToImageIndex = (idx) => {
    if (galleryImages.length === 0) return;
    const valid = Math.max(0, Math.min(idx, galleryImages.length - 1));
    setActiveImageIndex(valid);
    setActiveImage(galleryImages[valid]);
    if (quickGalleryRef.current) {
      quickGalleryRef.current.scrollTo({
        left: valid * quickGalleryRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleGalleryScroll = (e) => {
    const el = e.currentTarget;
    if (!el || el.clientWidth === 0) return;
    const newIdx = Math.round(el.scrollLeft / el.clientWidth);
    if (newIdx !== activeImageIndex && newIdx >= 0 && newIdx < galleryImages.length) {
      setActiveImageIndex(newIdx);
      setActiveImage(galleryImages[newIdx]);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock || isSelectedSizeOutOfStock) return;
    eventBus.emit(EVENTS.ADD_TO_CART, {
      ...product,
      selectedSize,
      quantity
    });
    setProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setProduct(null)}
      />

      <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 animate-scaleUp">
        <button
          onClick={() => setProduct(null)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-sand/50 hover:bg-brand-sand text-brand-dark flex items-center justify-center transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 bg-brand-sand/20 flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white shadow-md border border-brand-border/60 group">
              <div
                ref={quickGalleryRef}
                onScroll={handleGalleryScroll}
                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-full scroll-smooth select-none touch-pan-x"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {galleryImages.map((imgUrl, idx) => (
                  <div key={idx} className="shrink-0 w-full h-full snap-center snap-always relative overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={imgUrl}
                      alt={`${product.name} - ${idx + 1}`}
                      className="w-full h-full object-cover object-top select-none pointer-events-none"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>

              {galleryImages.length > 1 && (
                <>
                  {/* Indicator Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full z-10 pointer-events-auto">
                    {galleryImages.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => scrollToImageIndex(dotIdx)}
                        className={`transition-all rounded-full ${
                          activeImageIndex === dotIdx
                            ? 'w-4 h-1.5 bg-brand-gold'
                            : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
                        }`}
                        aria-label={`Photo ${dotIdx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Counter */}
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-mono px-2 py-0.5 rounded-full z-10 pointer-events-none">
                    {activeImageIndex + 1}/{galleryImages.length}
                  </div>

                  {/* Swipe Hint */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-full z-10 pointer-events-none">
                    Swipe &larr; &rarr;
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToImageIndex(idx)}
                    className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-brand-primary scale-102 shadow-sm' : 'border-brand-border/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-primary px-2 py-0.5 rounded bg-brand-primary/10">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating || 4.9}</span>
                </div>
              </div>

              <h3 className="font-serif text-2xl font-normal text-brand-dark leading-snug mb-2">
                {product.name}
              </h3>

              <div className="flex items-baseline gap-2.5 mb-4">
                <span className="text-2xl font-bold text-brand-dark">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-brand-muted line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {discount}% Off
                  </span>
                )}
              </div>

              <p className="text-xs text-brand-muted leading-relaxed mb-4">
                {product.description}
              </p>

              <div className="text-xs bg-brand-bg/80 p-3 rounded-lg border border-brand-border/60 mb-5 space-y-1">
                <div><strong className="text-brand-dark">Craft:</strong> {product.craft}</div>
                <div><strong className="text-brand-dark">Fabric:</strong> {product.fabric}</div>
                <div><strong className="text-brand-dark">Payment:</strong> 100% Encrypted Instant Online (UPI, Cards, NetBanking)</div>
              </div>

              {/* Size Selector */}
              <div className="mb-5">
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider mb-2">
                  <div className="flex items-center gap-2">
                    <span>Select Size:</span>
                    <span className="font-bold text-brand-primary">{selectedSize}</span>
                    {isSelectedSizeOutOfStock && (
                      <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded font-bold">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map((size) => {
                    const isSzOut = (product.outOfStockSizes || []).includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-9 min-w-9 px-3 rounded-lg text-xs font-medium border transition-all ${
                          selectedSize === size
                            ? isSzOut
                              ? 'border-red-500 bg-red-600 text-white shadow-xs'
                              : 'border-brand-primary bg-brand-primary text-white shadow-xs'
                            : isSzOut
                            ? 'border-red-200 bg-red-50 text-red-600 line-through'
                            : 'border-brand-border hover:border-brand-dark text-brand-dark bg-white'
                        }`}
                        title={isSzOut ? `Size ${size} Out of Stock` : `Size ${size}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider">Quantity:</span>
                <div className="inline-flex items-center border border-brand-border rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock || isSelectedSizeOutOfStock}
                    className="px-3 py-1 text-sm font-semibold hover:bg-brand-sand/50 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock || isSelectedSizeOutOfStock}
                    className="px-3 py-1 text-sm font-semibold hover:bg-brand-sand/50 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isSelectedSizeOutOfStock}
                className={`w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all ${
                  isOutOfStock
                    ? 'bg-neutral-300 text-neutral-600 cursor-not-allowed'
                    : isSelectedSizeOutOfStock
                    ? 'bg-red-100 text-red-700 border border-red-300 cursor-not-allowed'
                    : 'bg-brand-primary hover:bg-brand-primaryDark text-white hover:shadow-lg'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isOutOfStock
                    ? 'Currently Out of Stock'
                    : isSelectedSizeOutOfStock
                    ? `Size ${selectedSize} Out of Stock`
                    : `Add to Bag • ₹${(product.price * quantity).toLocaleString('en-IN')}`}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-brand-border/60 text-[11px] text-brand-muted">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-brand-primary" />
                  <span>7-Day Easy Exchange</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

