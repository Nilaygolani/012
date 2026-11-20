import React, { useRef, useState, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';

// Metadata presets for ethnic categories
const CATEGORY_META = {
  'Kurti Sets': {
    tag: 'Festive Pairs',
    tagline: 'Matching Kurti, Pants & Dupatta Sets'
  },
  'Long Kurtis': {
    tag: 'Office & Casual',
    tagline: 'Flowing Grace & A-Line Flared Cuts'
  },
  'Kurta Sets': {
    tag: 'Festive Pairs',
    tagline: 'Matching Kurti, Pants & Dupatta Sets'
  },
  'Long Kurtas': {
    tag: 'Office & Casual',
    tagline: 'Flowing Grace & A-Line Flared Cuts'
  },
  'Ethnic Bottoms': {
    tag: 'All-Day Ease',
    tagline: 'Linen Trousers & Flared Palazzos'
  },
  'Co-ord Sets': {
    tag: 'Modern Fusion',
    tagline: 'Contemporary Matching Sets & Duos'
  },
  'Short Kurtis': {
    tag: 'Trending Tops',
    tagline: 'Chic Everyday & College Wear'
  }
};

export default function CategoryPills() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [categories, setCategories] = useState([]);

  // Check scroll position to toggle navigation buttons
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
  }, [categories]);

  // Dynamic Category Sync from Backend so Admin additions appear automatically with real user photos!
  useEffect(() => {
    const fetchDynamicCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (res.ok) {
          const data = await res.json();
          const prods = data.products || [];
          if (prods.length > 0) {
            // Group products by category
            const catMap = {};
            prods.forEach((p) => {
              if (!p.category) return;
              if (!catMap[p.category]) {
                catMap[p.category] = [];
              }
              catMap[p.category].push(p);
            });

            // Preferred display order of categories
            const categoryOrder = ['Kurti Sets', 'Long Kurtis', 'Kurta Sets', 'Long Kurtas', 'Ethnic Bottoms', 'Co-ord Sets', 'Short Kurtis'];
            const dynamicList = [];

            // Add ordered categories first with the latest product's photo!
            categoryOrder.forEach((catName) => {
              const items = catMap[catName];
              if (items && items.length > 0) {
                const latest = items[0]; // Most recently added product
                const meta = CATEGORY_META[catName] || {};
                dynamicList.push({
                  id: catName.toLowerCase().replace(/\s+/g, '-'),
                  name: catName,
                  tagline: meta.tagline || (latest.fabric ? `${latest.fabric} • Handcrafted` : 'Authentic Jaipur Craft'),
                  image: latest.image || (latest.images && latest.images[0]) || '',
                  tag: latest.badge || meta.tag || 'Studio Collection',
                  count: `${items.length} ${items.length === 1 ? 'Design' : 'Designs'}`
                });
              }
            });

            // Also add any other custom categories that the admin created
            Object.keys(catMap).forEach((catName) => {
              if (!categoryOrder.includes(catName)) {
                const items = catMap[catName];
                const latest = items[0];
                dynamicList.push({
                  id: catName.toLowerCase().replace(/\s+/g, '-'),
                  name: catName,
                  tagline: latest.fabric ? `${latest.fabric} • Handcrafted` : 'Authentic Studio Craft',
                  image: latest.image || (latest.images && latest.images[0]) || '',
                  tag: latest.badge || 'New Arrival',
                  count: `${items.length} ${items.length === 1 ? 'Design' : 'Designs'}`
                });
              }
            });

            if (dynamicList.length > 0) {
              setCategories(dynamicList);
            }
          }
        }
      } catch (err) {
        console.warn('[CategoryPills] Could not fetch dynamic categories:', err);
      }
    };

    fetchDynamicCategories();
    const unbind = eventBus.on(EVENTS.REFRESH_CATALOG, fetchDynamicCategories);
    return () => unbind?.();
  }, []);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 360;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 350);
  };

  const handleSelect = (categoryName) => {
    eventBus.emit(EVENTS.BACK_TO_HOME);
    eventBus.emit(EVENTS.FILTER_CATEGORY, categoryName);
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-y border-brand-border/60 relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Left/Right Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sand text-brand-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Pure Kurti & Ensemble Studio</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl font-normal text-brand-dark">
              Shop by Kurti & Set Silhouettes
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted font-light mt-1">
              Scroll through our curated Jaipur mulmul tops, kalidar kurtis, and matching bottoms.
            </p>
          </div>

          {/* Left / Right Carousel Action Controls */}
          <div className="flex items-center gap-2 self-start sm:self-end">
            <span className="text-[11px] text-brand-muted hidden md:inline font-mono mr-2">
              Swipe or use controls &rarr;
            </span>

            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                canScrollLeft
                  ? 'border-brand-dark bg-white hover:bg-brand-primary hover:text-white text-brand-dark shadow-xs'
                  : 'border-brand-border/60 bg-brand-sand/30 text-brand-muted/40 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
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
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Carousel Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat.name)}
              className="group relative cursor-pointer flex flex-col shrink-0 w-[240px] sm:w-[280px] snap-start overflow-hidden rounded-3xl bg-brand-sand/30 border border-brand-border/80 hover:border-brand-primary/50 transition-all duration-500 shadow-2xs hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-sand">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

                {/* Top Badge Tag */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold bg-white/95 text-brand-dark backdrop-blur-md shadow-xs">
                    {cat.tag}
                  </span>
                </div>

                {/* Top Right Action Circle */}
                <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-90 group-hover:opacity-100 group-hover:bg-brand-primary transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block mb-0.5">
                    {cat.count}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-normal leading-tight group-hover:text-brand-gold transition-colors">
                    {cat.name}
                  </h4>
                  <span className="text-xs text-brand-sand/80 font-light block mt-1 line-clamp-1">
                    {cat.tagline}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
