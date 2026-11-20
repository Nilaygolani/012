import React, { useRef, useState, useEffect } from 'react';
import {
  Instagram, Play, Pause, Volume2, VolumeX, ShoppingBag, Eye,
  ChevronLeft, ChevronRight, X, Heart, Sparkles, ExternalLink, ArrowRight
} from 'lucide-react';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';

export default function InstagramReels() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Video Modal State
  const [activeReelIndex, setActiveReelIndex] = useState(null); // null when modal closed
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likedMap, setLikedMap] = useState({});
  const videoRef = useRef(null);

  // Fetch Reels from Backend API
  const fetchReels = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/reels');
      if (res.ok) {
        const data = await res.json();
        setReels(data.reels || []);
      }
    } catch (err) {
      console.warn('[Reels] Could not reach backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
    const unbind = eventBus.on(EVENTS.REFRESH_REELS, fetchReels);
    return () => unbind?.();
  }, []);

  // Check horizontal scroll limits
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [reels]);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 350);
  };

  // Video Modal Handlers
  const openReelModal = (index) => {
    setActiveReelIndex(index);
    setIsPlaying(true);
    setIsMuted(false);
  };

  const closeReelModal = () => {
    setActiveReelIndex(null);
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLike = async (e, reelId) => {
    e.stopPropagation();
    if (likedMap[reelId]) return;
    setLikedMap(prev => ({ ...prev, [reelId]: true }));
    try {
      await fetch(`http://localhost:5000/api/reels/${reelId}/like`, { method: 'POST' });
    } catch (e) {}
  };

  const handleViewProduct = (productId) => {
    closeReelModal();
    if (productId) {
      eventBus.emit(EVENTS.VIEW_PRODUCT_DETAIL, productId);
    } else {
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeReel = activeReelIndex !== null ? reels[activeReelIndex] : null;

  return (
    <section className="py-16 sm:py-24 bg-brand-bg relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Scroll Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] font-bold text-brand-primary mb-2">
              <Instagram className="w-3.5 h-3.5" />
              <span>@nailmores atelier &bull; In Motion</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl font-normal text-brand-dark">
              In Motion & Moments
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted mt-1 font-light">
              Watch our Jaipur mulmul kurtis twirl & style in real-time video drops.
            </p>
          </div>

          {/* Left / Right Carousel Controls */}
          <div className="flex items-center gap-2 self-start sm:self-end">
            <span className="text-[11px] text-brand-muted hidden md:inline font-mono mr-2">
              Scroll video drops &rarr;
            </span>

            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                canScrollLeft
                  ? 'border-brand-dark bg-white hover:bg-brand-primary hover:text-white text-brand-dark shadow-xs'
                  : 'border-brand-border/60 bg-brand-sand/30 text-brand-muted/40 cursor-not-allowed'
              }`}
              aria-label="Previous reels"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                canScrollRight
                  ? 'border-brand-dark bg-white hover:bg-brand-primary hover:text-white text-brand-dark shadow-xs'
                  : 'border-brand-border/60 bg-brand-sand/30 text-brand-muted/40 cursor-not-allowed'
              }`}
              aria-label="Next reels"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Video Reels Carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {reels.map((reel, idx) => (
            <div
              key={reel.id}
              onClick={() => openReelModal(idx)}
              className="group relative shrink-0 w-[220px] sm:w-[260px] aspect-[9/16] rounded-3xl snap-start overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer bg-brand-dark border border-brand-border/80 hover:border-brand-primary/60 hover:-translate-y-1"
            >
              <img
                src={reel.coverImage}
                alt={reel.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.meesho.com/images/products/1096061321/8kuz6_512.avif?width=512';
                }}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

              {/* Glowing Play Badge */}
              <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-115 group-hover:bg-brand-primary transition-all duration-300 shadow-md">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>

              {/* Top Reel Counter */}
              <div className="absolute top-3.5 left-3.5">
                <span className="px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold bg-black/40 text-brand-sand backdrop-blur-xs border border-white/10">
                  Video Drop
                </span>
              </div>

              {/* Caption, Views & Tagged Product */}
              <div className="absolute inset-x-3.5 bottom-3.5 text-white">
                <div className="flex items-center justify-between text-[10px] text-brand-gold font-bold mb-1.5">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{reel.views} Views</span>
                  </div>
                  {reel.likes && (
                    <div className="flex items-center gap-1 text-white/80">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>{reel.likes}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs font-normal leading-snug line-clamp-2 mb-2.5 font-serif">
                  {reel.title}
                </p>

                {/* Tagged Kurti Button */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProduct(reel.productId);
                  }}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 hover:bg-brand-primary hover:border-transparent transition-colors cursor-pointer"
                  title="View Tagged Silhouette"
                >
                  <div className="truncate mr-2">
                    <span className="text-[10px] uppercase font-bold block truncate text-white">
                      {reel.productName || 'Tagged Kurti'}
                    </span>
                    <span className="text-[10px] text-brand-sand/90 font-mono">
                      ₹{reel.productPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ============================================================== */}
      {/* INTERACTIVE FULL-SCREEN VIDEO REEL VIEWER MODAL */}
      {/* ============================================================== */}
      {activeReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-fadeIn">
          
          {/* Modal Background Click to Close */}
          <div className="absolute inset-0" onClick={closeReelModal} />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-sm sm:max-w-md aspect-[9/16] max-h-[92vh] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col">
            
            {/* HTML5 Video Element */}
            <video
              ref={videoRef}
              src={activeReel.videoUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              onClick={togglePlayPause}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Dark Top and Bottom Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60 pointer-events-none" />

            {/* Top Controls Bar */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-20">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] uppercase tracking-widest font-bold">nailmores live reel</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={closeReelModal}
                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Play/Pause Indicator if paused */}
            {!isPlaying && (
              <div
                onClick={togglePlayPause}
                className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white scale-110 shadow-2xl">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
              </div>
            )}

            {/* Right Action Icons (Like, Shop, Prev, Next) */}
            <div className="absolute right-3.5 bottom-28 flex flex-col items-center gap-4 text-white z-20">
              {/* Like Button */}
              <button
                onClick={(e) => handleLike(e, activeReel.id)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                  likedMap[activeReel.id] ? 'bg-rose-600 text-white scale-110' : 'bg-black/50 hover:bg-black/80 text-white'
                }`}>
                  <Heart className={`w-5 h-5 ${likedMap[activeReel.id] ? 'fill-current' : ''}`} />
                </div>
                <span className="text-[10px] font-bold font-mono">
                  {likedMap[activeReel.id] ? parseInt(activeReel.likes || '100') + 1 : activeReel.likes || '120'}
                </span>
              </button>

              {/* Prev Reel */}
              {activeReelIndex > 0 && (
                <button
                  onClick={() => openReelModal(activeReelIndex - 1)}
                  className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center backdrop-blur-md text-white transition-colors"
                  title="Previous Reel"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Next Reel */}
              {activeReelIndex < reels.length - 1 && (
                <button
                  onClick={() => openReelModal(activeReelIndex + 1)}
                  className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center backdrop-blur-md text-white transition-colors"
                  title="Next Reel"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Bottom Caption & Tagged Kurti Card */}
            <div className="absolute inset-x-4 bottom-4 z-20 text-white space-y-3">
              <div>
                <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">
                  {activeReel.tags ? activeReel.tags.join(' ') : '#NailmoresCouture'}
                </span>
                <h4 className="font-serif text-sm sm:text-base font-normal leading-snug mt-0.5">
                  {activeReel.title}
                </h4>
              </div>

              {/* Attached Kurti Purchase Pill */}
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-between gap-3 shadow-xl">
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-brand-sand block truncate">
                    Featured Ensemble
                  </span>
                  <p className="font-serif text-xs font-semibold text-white truncate">
                    {activeReel.productName || 'Pure Mulmul Kurti'}
                  </p>
                  <span className="text-xs font-bold text-brand-gold font-sans">
                    ₹{activeReel.productPrice?.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => handleViewProduct(activeReel.productId)}
                  className="inline-flex items-center gap-1.5 bg-brand-sand hover:bg-white text-brand-dark px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 transition-all shadow-md active:scale-95"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
