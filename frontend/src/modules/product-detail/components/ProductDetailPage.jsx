import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Star, Heart, ShoppingBag, Truck, RefreshCw, Sparkles, ShieldCheck,
  Check, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Share2, Ruler, MessageSquarePlus, CreditCard
} from 'lucide-react';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';
import { useAuthStore } from '../../../core/auth/authStore';
import { API_BASE_URL } from '../../../config/api';

export default function ProductDetailPage({ productId, onBack }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const mainGalleryRef = useRef(null);
  const thumbnailStripRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const galleryImages = (Array.isArray(product?.images) && product?.images.length > 0)
    ? product.images
    : [product?.image, product?.hoverImage].filter(Boolean);

  const scrollToImageIndex = (idx) => {
    if (galleryImages.length === 0) return;
    const validIdx = Math.max(0, Math.min(idx, galleryImages.length - 1));
    setActiveImageIndex(validIdx);
    setActiveImage(galleryImages[validIdx]);
    if (mainGalleryRef.current) {
      const width = mainGalleryRef.current.clientWidth;
      mainGalleryRef.current.scrollTo({
        left: validIdx * width,
        behavior: 'smooth'
      });
    }
  };

  const handleGalleryScroll = (e) => {
    const el = e.currentTarget;
    if (!el || el.clientWidth === 0) return;
    const scrollPos = el.scrollLeft;
    const width = el.clientWidth;
    const newIdx = Math.round(scrollPos / width);
    if (newIdx !== activeImageIndex && newIdx >= 0 && newIdx < galleryImages.length) {
      setActiveImageIndex(newIdx);
      setActiveImage(galleryImages[newIdx]);
    }
  };

  // Mouse Drag to Swipe (Desktop)
  const handleMouseDown = (e) => {
    if (!mainGalleryRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - (mainGalleryRef.current.offsetLeft || 0);
    scrollLeftRef.current = mainGalleryRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !mainGalleryRef.current) return;
    e.preventDefault();
    const x = e.pageX - (mainGalleryRef.current.offsetLeft || 0);
    const walk = (x - startXRef.current) * 1.5;
    mainGalleryRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current || !mainGalleryRef.current) return;
    isDraggingRef.current = false;
    const width = mainGalleryRef.current.clientWidth;
    if (width > 0) {
      const targetIdx = Math.round(mainGalleryRef.current.scrollLeft / width);
      scrollToImageIndex(targetIdx);
    }
  };

  useEffect(() => {
    if (thumbnailStripRef.current && thumbnailStripRef.current.children[activeImageIndex]) {
      thumbnailStripRef.current.children[activeImageIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [activeImageIndex]);

  // Accordion open states
  const [openAccordion, setOpenAccordion] = useState('details'); // 'details', 'styling', 'care', 'delivery'

  // Inline Review Form state
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const { user, token } = useAuthStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch product details
    fetch(`${API_BASE_URL}/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setActiveImage(data.image);
        setSelectedSize(data.sizes?.[0] || 'M');
      })
      .catch(err => console.warn('[PDP] Could not fetch product:', err));

    // Fetch all products to populate "You May Also Love"
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        const others = (data.products || []).filter(p => p.id !== productId);
        setRelatedProducts(others.slice(0, 4));
      })
      .catch(() => {});

    // Fetch reviews for this specific product
    fetch(`${API_BASE_URL}/api/reviews/product/${productId}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || []);
      })
      .catch(() => {});
  }, [productId]);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <p className="text-brand-muted text-sm">Loading silhouette details...</p>
      </div>
    );
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isProductOutOfStock = product.inStock === false || (product.stock !== undefined && product.stock <= 0);
  const isSelectedSizeOutOfStock = (product.outOfStockSizes || []).includes(selectedSize);

  const handleAddToCart = () => {
    if (isProductOutOfStock || isSelectedSizeOutOfStock) return;
    eventBus.emit(EVENTS.ADD_TO_CART, {
      ...product,
      selectedSize,
      quantity
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isProductOutOfStock || isSelectedSizeOutOfStock) return;
    eventBus.emit(EVENTS.ADD_TO_CART, {
      ...product,
      selectedSize,
      quantity
    });
    eventBus.emit(EVENTS.OPEN_CART);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    eventBus.emit(EVENTS.TOGGLE_WISHLIST, product);
  };

  const handleWriteReview = () => {
    if (!user) {
      eventBus.emit(EVENTS.OPEN_AUTH_MODAL);
    } else {
      setIsReviewFormOpen(!isReviewFormOpen);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token || !newReviewComment.trim()) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          rating: newReviewRating,
          comment: newReviewComment.trim()
        })
      });
      if (res.ok) {
        const d = await res.json();
        setReviews(prev => [d.review, ...prev]);
        setNewReviewComment('');
        setIsReviewFormOpen(false);
        setReviewSuccessMsg('Thank you! Your verified review has been published.');
        setTimeout(() => setReviewSuccessMsg(null), 4000);
      }
    } catch (e) {
      console.warn('[PDP] Review submission error:', e);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen py-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Back Navigation */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-brand-border/60 text-xs">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 font-semibold text-brand-dark hover:text-brand-primary transition-colors py-1.5 px-3 rounded-full hover:bg-brand-sand/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Kurtis & Sets</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-brand-muted">
            <span className="hover:underline cursor-pointer" onClick={onBack}>Home</span>
            <span>&rsaquo;</span>
            <span className="font-medium text-brand-dark">{product.category}</span>
            <span>&rsaquo;</span>
            <span className="text-brand-muted truncate max-w-xs">{product.name}</span>
          </div>
        </div>

        {/* Product Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20">
          
          {/* Left Column: Vertical Thumbnails + Main Photo Gallery (Swipeable) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Dynamic Thumbnails list (Multiple Images) */}
            {galleryImages.length > 1 && (
              <div
                ref={thumbnailStripRef}
                className="flex sm:flex-col gap-2.5 shrink-0 overflow-x-auto sm:overflow-y-auto no-scrollbar max-h-[580px] pb-2 sm:pb-0"
              >
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToImageIndex(idx)}
                    className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 relative group ${
                      activeImageIndex === idx
                        ? 'border-brand-primary shadow-lg ring-2 ring-brand-primary/20 scale-102'
                        : 'border-brand-border/60 opacity-70 hover:opacity-100 hover:border-brand-dark'
                    }`}
                    title={`View Photo ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover object-top" />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/60 text-white text-[8px] font-mono">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Main High-Res Image Frame with Native Finger Swipe & Horizontal Scroll */}
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-white shadow-xl border border-brand-border/80 group">
              {/* Swipeable / Scrollable Images Container */}
              <div
                ref={mainGalleryRef}
                onScroll={handleGalleryScroll}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-full scroll-smooth cursor-grab active:cursor-grabbing select-none touch-pan-x"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {galleryImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="shrink-0 w-full h-full snap-center snap-always relative overflow-hidden bg-white flex items-center justify-center"
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} - Photo ${idx + 1}`}
                      className="w-full h-full object-cover object-top select-none pointer-events-none transition-transform duration-500"
                      draggable="false"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                ))}
              </div>

              {/* Swipeable Indicator Dots at Bottom */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full z-20 pointer-events-auto">
                  {galleryImages.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => scrollToImageIndex(dotIdx)}
                      className={`transition-all rounded-full ${
                        activeImageIndex === dotIdx
                          ? 'w-5 h-2 bg-brand-gold shadow-sm'
                          : 'w-2 h-2 bg-white/60 hover:bg-white'
                      }`}
                      aria-label={`Photo ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Image Counter Pill (Bottom Right) */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1 rounded-full z-10 border border-white/20 pointer-events-none">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>

              {/* Swipe Hint (Mobile / Touch Viewers) */}
              {galleryImages.length > 1 && (
                <div className="sm:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white text-[9px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full z-10 border border-white/10 pointer-events-none">
                  Swipe photos &larr; &rarr;
                </div>
              )}

              {/* Left/Right Flip Arrows for Desktop */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const prev = activeImageIndex > 0 ? activeImageIndex - 1 : galleryImages.length - 1;
                      scrollToImageIndex(prev);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-brand-dark shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      const next = activeImageIndex < galleryImages.length - 1 ? activeImageIndex + 1 : 0;
                      scrollToImageIndex(next);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-brand-dark shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {product.badge && (
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-brand-dark/90 text-brand-sand backdrop-blur-md shadow-xs">
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Wishlist Floating Button on PDP */}
              <button
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md z-20 ${
                  isWishlisted
                    ? 'bg-brand-primary text-white scale-110'
                    : 'bg-white/80 hover:bg-white text-brand-dark'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Column: Buying Box & Specifications */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                  {product.category} &bull; Pure Jaipur Craft
                </span>
                <div className="flex items-center gap-1.5 text-amber-500 font-semibold text-xs bg-white px-2.5 py-1 rounded-full border border-brand-border/60">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating || 4.9}</span>
                  <span className="text-brand-muted font-normal text-[10px]">({reviews.length} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-brand-dark leading-tight mb-3">
                {product.name}
              </h1>

              {/* Price Details */}
              <div className="flex items-baseline gap-3 pb-4 mb-4 border-b border-brand-border/60">
                <span className="text-3xl font-bold text-brand-dark font-sans">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-brand-muted line-through font-sans">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Save {discount}%
                  </span>
                )}
              </div>

              <p className="text-xs text-brand-muted/90 font-light leading-relaxed mb-6">
                {product.description}
              </p>

                {/* Size Selector */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">Select Size:</span>
                      <span className="text-xs font-serif font-bold text-brand-primary">{selectedSize}</span>
                      {isSelectedSizeOutOfStock && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                          Sold Out in this size
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-brand-primary hover:underline flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Chart</span>
                    </button>
                  </div>

                  {/* Size Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {product.sizes?.map((size) => {
                      const isOut = (product.outOfStockSizes || []).includes(size);
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`h-11 min-w-11 px-4 rounded-xl text-xs font-bold transition-all relative flex flex-col items-center justify-center ${
                            isSelected
                              ? isOut
                                ? 'border-2 border-red-500 bg-red-600 text-white shadow-md'
                                : 'border-2 border-brand-primary bg-brand-primary text-white shadow-md'
                              : isOut
                              ? 'border border-red-200 bg-red-50/60 text-red-700/70 hover:border-red-400'
                              : 'border border-brand-border bg-white text-brand-dark hover:border-brand-dark'
                          }`}
                        >
                          <span className={isOut ? 'line-through' : ''}>{size}</span>
                          {isOut && (
                            <span className="text-[8px] font-normal uppercase tracking-tight opacity-90">Out</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Size Chart Popup */}
                  {showSizeGuide && (
                    <div className="mt-3 p-4 bg-white rounded-xl border border-brand-border text-xs shadow-md space-y-2">
                      <p className="font-bold text-brand-dark">Regular Tailored Fit (Measurement Guide in inches):</p>
                      <div className="grid grid-cols-5 text-center gap-1 font-mono text-[11px] pt-1">
                        <div className="p-1 bg-brand-sand/50 rounded">XS: 34"</div>
                        <div className="p-1 bg-brand-sand/50 rounded">S: 36"</div>
                        <div className="p-1 bg-brand-sand/50 rounded">M: 38"</div>
                        <div className="p-1 bg-brand-sand/50 rounded">L: 40"</div>
                        <div className="p-1 bg-brand-sand/50 rounded">XL: 42"</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity & Stock Indicator */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-brand-border/60">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider">Qty:</span>
                    <div className="inline-flex items-center border border-brand-border rounded-xl bg-white shadow-2xs">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={isProductOutOfStock || isSelectedSizeOutOfStock}
                        className="px-3.5 py-1.5 text-sm font-bold hover:bg-brand-sand/40 text-brand-dark disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={isProductOutOfStock || isSelectedSizeOutOfStock}
                        className="px-3.5 py-1.5 text-sm font-bold hover:bg-brand-sand/40 text-brand-dark disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Small-Batch Atelier Craft</span>
                  </div>
                </div>

                {/* Action Buttons: Add to Bag & Buy Now (Razorpay) */}
                <div className="space-y-3">
                  {isProductOutOfStock ? (
                    <div className="w-full py-4 rounded-full bg-neutral-200 text-neutral-600 text-xs font-bold uppercase tracking-wider text-center cursor-not-allowed border border-neutral-300">
                      Silhouette Currently Out of Stock
                    </div>
                  ) : isSelectedSizeOutOfStock ? (
                    <div className="space-y-2">
                      <div className="w-full py-4 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider text-center cursor-not-allowed border border-red-300">
                        Size {selectedSize} is Out of Stock &bull; Please select another size
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleAddToCart}
                        className={`py-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                          justAdded
                            ? 'bg-emerald-700 text-white'
                            : 'bg-white hover:bg-brand-sand/40 border border-brand-dark text-brand-dark'
                        }`}
                      >
                        {justAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added to Bag</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleBuyNow}
                        className="py-4 rounded-full bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
                      >
                        <CreditCard className="w-4 h-4 text-brand-sand" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-center text-brand-muted">
                    🔒 100% Encrypted Instant Checkout (UPI, Cards & NetBanking). <em>Cash on Delivery not available</em>.
                  </p>
                </div>

              {/* Value Assurance Badges */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-brand-border/60 text-[11px] text-brand-dark font-medium">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-brand-border/60">
                  <Truck className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>100% Free Express Delivery on All Orders</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-brand-border/60">
                  <RefreshCw className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>7-Day Doorstep Size Exchange Guarantee</span>
                </div>
              </div>
            </div>

            {/* Accordion Specs */}
            <div className="space-y-2 pt-6">
              {/* 1. Styling Tips */}
              <div className="border border-brand-border rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'styling' ? '' : 'styling')}
                  className="w-full p-3.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-dark text-left"
                >
                  <span>How to Style this Silhouette</span>
                  {openAccordion === 'styling' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-brand-muted" />}
                </button>
                {openAccordion === 'styling' && (
                  <div className="p-3.5 pt-0 text-xs text-brand-muted font-light leading-relaxed border-t border-brand-border/40">
                    {product.stylingTips || 'Pairs effortlessly with straight cotton trousers, wide-leg denim, or flared palazzos.'}
                  </div>
                )}
              </div>

              {/* 2. Fabric & Care */}
              <div className="border border-brand-border rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'care' ? '' : 'care')}
                  className="w-full p-3.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-dark text-left"
                >
                  <span>100% Pure Cotton & Wash Care</span>
                  {openAccordion === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-brand-muted" />}
                </button>
                {openAccordion === 'care' && (
                  <div className="p-3.5 pt-0 text-xs text-brand-muted font-light leading-relaxed border-t border-brand-border/40 space-y-1">
                    <div><strong>Fabric:</strong> {product.fabric}</div>
                    <div><strong>Craftsmanship:</strong> {product.craft}</div>
                    <div><strong>Wash Care:</strong> {product.washCare || 'Gentle hand wash in cold water using mild detergent.'}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Customer Reviews Section on PDP */}
        <section className="pt-12 pb-16 border-t border-brand-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                Customer Testimonials
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-brand-dark mt-0.5">
                Reviews for {product.name}
              </h3>
            </div>

            <button
              onClick={handleWriteReview}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-brand-gold" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Review Success Alert */}
          {reviewSuccessMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{reviewSuccessMsg}</span>
            </div>
          )}

          {/* Inline Write Review Form directly under the product */}
          {isReviewFormOpen && (
            <div className="mb-8 p-6 rounded-3xl bg-white border border-brand-border/80 shadow-md animate-fadeIn">
              <h4 className="font-serif text-lg font-medium text-brand-dark mb-1">
                Share Your Fitting Experience
              </h4>
              <p className="text-xs text-brand-muted mb-4">
                Posting verified patron review for <strong>{product.name}</strong> as <strong>{user?.name}</strong>.
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-brand-muted mb-1.5">
                    Your Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 text-amber-500 hover:scale-125 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= newReviewRating ? 'fill-current' : 'stroke-[1.5]'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-brand-dark ml-2">
                      ({newReviewRating} / 5 Stars)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-brand-muted mb-1">
                    Your Review & Fitting Feedback *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="How was the mulmul fabric comfort, stitching, and twirl? Describe your experience..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border border-brand-border bg-brand-sand/20 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsReviewFormOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-brand-border text-brand-dark hover:bg-brand-sand/40 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-6 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
                  >
                    {reviewSubmitting ? 'Posting Review...' : 'Post Customer Review'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-brand-border text-center space-y-2">
              <Star className="w-8 h-8 text-amber-500 mx-auto fill-current" />
              <p className="font-serif text-base text-brand-dark">Be the first to review this handcrafted design!</p>
              <p className="text-xs text-brand-muted">Share your fitting experience and fabric feel with fellow patrons.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-xl bg-white border border-brand-border space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-dark">{rev.userName}</span>
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-brand-dark/80 font-light leading-relaxed">"{rev.comment}"</p>
                  <span className="text-[10px] text-brand-muted block pt-1">Verified Purchase</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* You May Also Love (Related Kurtis & Bottoms) */}
        {relatedProducts.length > 0 && (
          <section className="pt-12 border-t border-brand-border/60">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                  Complete Your Ensemble
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-brand-dark mt-0.5">
                  Complementary Silhouettes
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    eventBus.emit(EVENTS.VIEW_PRODUCT_DETAIL, rel.id);
                  }}
                  className="group bg-white rounded-2xl overflow-hidden border border-brand-border hover:border-brand-primary/40 transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-brand-sand/30">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5 flex flex-col flex-1">
                    <span className="text-[10px] uppercase font-bold text-brand-primary tracking-wider mb-1">
                      {rel.category}
                    </span>
                    <h5 className="font-serif font-medium text-sm text-brand-dark line-clamp-1 group-hover:text-brand-primary transition-colors">
                      {rel.name}
                    </h5>
                    <span className="text-sm font-bold text-brand-dark mt-auto pt-2">
                      ₹{rel.price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Mobile Sticky Bottom Action Bar for seamless phone experience */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-brand-border px-4 py-3 z-40 shadow-2xl flex items-center gap-3">
        <div>
          <span className="text-[10px] text-brand-muted block uppercase font-medium">Price</span>
          <span className="font-serif text-lg font-bold text-brand-dark">
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex-1 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 rounded-full border border-brand-dark bg-white active:bg-brand-sand/50 text-brand-dark text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-3 rounded-full bg-brand-primary active:bg-brand-primaryDark text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}

