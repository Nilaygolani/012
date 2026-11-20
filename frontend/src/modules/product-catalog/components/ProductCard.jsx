import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.inStock === false || (product.stock !== undefined && product.stock <= 0);
  const isSelectedSizeOutOfStock = (product.outOfStockSizes || []).includes(selectedSize);

  const handleOpenDetail = (e) => {
    e?.stopPropagation();
    eventBus.emit(EVENTS.VIEW_PRODUCT_DETAIL, product.id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock || isSelectedSizeOutOfStock) return;
    eventBus.emit(EVENTS.ADD_TO_CART, {
      ...product,
      selectedSize,
      quantity: 1
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    eventBus.emit(EVENTS.TOGGLE_WISHLIST, product);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-brand-border/70 hover:border-brand-primary/40 transition-all duration-500 hover:shadow-xl cursor-pointer"
      onClick={handleOpenDetail}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-sand/40">
        <img
          src={isHovered && product.hoverImage ? product.hoverImage : product.image}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-106"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10 pointer-events-none">
          {isOutOfStock ? (
            <span className="bg-red-600 text-white text-[8px] sm:text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md">
              Out of Stock
            </span>
          ) : product.badge ? (
            <span className="bg-brand-dark/90 text-brand-sand text-[8px] sm:text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-xs shadow-xs border border-white/20">
              {product.badge}
            </span>
          ) : null}
          {discount > 0 && !isOutOfStock && (
            <span className="bg-brand-primary text-white text-[8px] sm:text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full shadow-xs">
              Save {discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            isWishlisted
              ? 'bg-brand-primary text-white shadow-md'
              : 'bg-white/80 hover:bg-white text-brand-dark hover:text-brand-primary backdrop-blur-xs shadow-xs'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : 'stroke-[1.8]'}`} />
        </button>

        {/* Hover Action Overlay (Desktop Only - hidden on mobile so it doesn't obstruct tap) */}
        <div className="hidden sm:flex absolute inset-x-2.5 bottom-2.5 z-10 flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {/* Glass Size Selector Bar */}
          <div className="glass-card rounded-xl p-2 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-[9px] font-bold text-brand-muted uppercase tracking-wider mb-1.5 px-1">
              <span>Select Size</span>
              <button onClick={handleOpenDetail} className="text-brand-primary hover:underline flex items-center gap-1 font-semibold">
                <Eye className="w-3 h-3" /> Full View
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              {product.sizes?.map((size) => {
                const isSzOut = (product.outOfStockSizes || []).includes(size);
                return (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    className={`text-[10px] font-semibold min-w-7 h-7 px-1.5 rounded-lg border transition-all ${
                      selectedSize === size
                        ? isSzOut
                          ? 'border-red-500 bg-red-600 text-white shadow-xs'
                          : 'border-brand-primary bg-brand-primary text-white shadow-xs'
                        : isSzOut
                        ? 'border-red-200 bg-red-50/80 text-red-600 line-through'
                        : 'border-brand-border hover:border-brand-dark text-brand-dark bg-white/90'
                    }`}
                    title={isSzOut ? `Size ${size} Out of Stock` : `Size ${size}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Add To Bag Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isSelectedSizeOutOfStock}
            className={`w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
              isOutOfStock
                ? 'bg-neutral-300 text-neutral-600 cursor-not-allowed'
                : isSelectedSizeOutOfStock
                ? 'bg-red-100 text-red-700 border border-red-300 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-brand-dark hover:bg-brand-primary text-white'
            }`}
          >
            {isOutOfStock ? (
              <span>Sold Out</span>
            ) : isSelectedSizeOutOfStock ? (
              <span>Size {selectedSize} Out of Stock</span>
            ) : justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-brand-sand" />
                <span>Quick Add &bull; ({selectedSize})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Info Box */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-brand-muted mb-1">
          <span className="uppercase tracking-widest font-semibold text-[9px] sm:text-[10px] text-brand-primary truncate max-w-[90px] sm:max-w-none">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-amber-500 font-semibold text-[10px] sm:text-xs shrink-0">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
            <span>{product.rating || 4.9}</span>
          </div>
        </div>

        <h4 className="font-serif text-xs sm:text-base font-normal text-brand-dark group-hover:text-brand-primary transition-colors line-clamp-1 mb-0.5 sm:mb-1">
          {product.name}
        </h4>

        <p className="text-[10px] sm:text-[11px] text-brand-muted/80 font-light truncate mb-2 sm:mb-3">
          {product.craft} &bull; {product.fabric}
        </p>

        {/* Pricing Row */}
        <div className="mt-auto pt-1.5 sm:pt-2 flex items-baseline justify-between border-t border-brand-border/40">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-base font-bold text-brand-dark font-sans">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-brand-muted line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <span className="text-[9px] sm:text-[10px] text-brand-primary font-semibold hover:underline hidden xs:inline sm:inline">
            View &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}
