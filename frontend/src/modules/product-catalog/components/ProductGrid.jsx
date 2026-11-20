import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { Sparkles, Loader2, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';

const TABS = [
  { id: 'all', label: 'All Silhouettes' },
  { id: 'Short Kurtis', label: 'Short Kurtis' },
  { id: 'Long Kurtis', label: 'Long Kurtis' },
  { id: 'Kurti Sets', label: 'Kurti Sets' },
  { id: 'Ethnic Bottoms', label: 'Bottoms & Pants' },
  { id: 'Co-ord Sets', label: 'Co-ord Duos' }
];

// Helper to diversify products so color variants of the same design don't sit side-by-side
function diversifyProducts(items) {
  if (!items || items.length <= 2) return items || [];

  const colorWords = [
    'red', 'maroon', 'green', 'blue', 'brown', 'black', 'white', 'beige',
    'pink', 'onion', 'yellow', 'purple', 'grey', 'gray', 'color', 'colour'
  ];

  const getDesignKey = (p) => {
    if (!p || !p.name) return Math.random().toString();
    let clean = p.name.toLowerCase();
    colorWords.forEach((c) => {
      clean = clean.replace(new RegExp(`\\b${c}\\b`, 'gi'), '');
    });
    const words = clean.replace(/[^a-z0-9\s]/gi, ' ').split(/\s+/).filter((w) => w.length > 2);
    return words.slice(0, 3).join('-') || p.name.substring(0, 15);
  };

  const groups = {};
  items.forEach((item) => {
    const key = getDesignKey(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  const groupKeys = Object.keys(groups);
  if (groupKeys.length <= 1) return items;

  const interleaved = [];
  let added = true;
  let idx = 0;

  while (added) {
    added = false;
    for (let i = 0; i < groupKeys.length; i++) {
      const g = groups[groupKeys[i]];
      if (idx < g.length) {
        interleaved.push(g[idx]);
        added = true;
      }
    }
    idx++;
  }

  return interleaved;
}

// Auto-scrolling horizontal row component (shows 4 items at a time on desktop)
function AutoScrollShelf({
  title,
  subtitle,
  badge,
  products = [],
  autoScrollDelay = 4500
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  // Auto-scroll loop: advances by 4 cards (clientWidth) smoothly
  useEffect(() => {
    if (products.length <= 4) return;
    if (isHovered) return;

    const timer = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 25) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
      }
      setTimeout(checkScroll, 400);
    }, autoScrollDelay);

    return () => clearInterval(timer);
  }, [products.length, isHovered, autoScrollDelay]);

  const handleManualScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 400);
  };

  // Diversified items list
  const displayItems = diversifyProducts(products);
  if (!displayItems || displayItems.length === 0) return null;

  return (
    <div
      className="mb-14 last:mb-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shelf Header */}
      <div className="flex items-end justify-between mb-5 pb-3 border-b border-brand-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary">
                {badge}
              </span>
            )}
            <span className="text-[11px] font-mono text-brand-muted">
              {products.length} {products.length === 1 ? 'Design' : 'Designs'} &bull; Auto-sliding
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-brand-dark">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-brand-muted mt-0.5 font-light">{subtitle}</p>
          )}
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2">
          {products.length > 4 && (
            <>
              <button
                onClick={() => handleManualScroll('left')}
                disabled={!canScrollLeft}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  canScrollLeft
                    ? 'border-brand-dark bg-white hover:bg-brand-primary hover:text-white text-brand-dark shadow-xs'
                    : 'border-brand-border/60 bg-brand-sand/30 text-brand-muted/40 cursor-not-allowed'
                }`}
                aria-label="Previous items"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleManualScroll('right')}
                disabled={!canScrollRight}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  canScrollRight
                    ? 'border-brand-dark bg-white hover:bg-brand-primary hover:text-white text-brand-dark shadow-xs'
                    : 'border-brand-border/60 bg-brand-sand/30 text-brand-muted/40 cursor-not-allowed'
                }`}
                aria-label="Next items"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Horizontal Scroll Track: Exactly 4 cards visible across desktop */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-3"
      >
        {displayItems.map((product) => (
          <div
            key={product.id}
            className="w-[calc(100%-1rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.warn('[Catalog] Could not reach backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const unbindFilter = eventBus.on(EVENTS.FILTER_CATEGORY, (categoryName) => {
      let targetName = categoryName;
      if (categoryName.toLowerCase() === 'long kurtas') targetName = 'Long Kurtis';
      if (categoryName.toLowerCase() === 'kurta sets') targetName = 'Kurti Sets';
      const match = TABS.find((t) =>
        t.label.toLowerCase().includes(targetName.toLowerCase()) ||
        t.id.toLowerCase().includes(targetName.toLowerCase()) ||
        targetName.toLowerCase().includes(t.id.toLowerCase())
      );
      if (match) setActiveTab(match.id);
      else setActiveTab('all');
    });

    const unbindRefresh = eventBus.on(EVENTS.REFRESH_CATALOG, fetchProducts);

    return () => {
      unbindFilter?.();
      unbindRefresh?.();
    };
  }, []);

  // Sort helper
  const sortList = (items) => {
    return [...items].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  };

  // Group products by category for the 4 distinct rows
  const shortKurtis = sortList(products.filter((p) => p.category?.toLowerCase() === 'short kurtis'));
  const ethnicBottoms = sortList(products.filter((p) =>
    p.category?.toLowerCase() === 'ethnic bottoms' || p.category?.toLowerCase() === 'bottoms'
  ));
  const longKurtis = sortList(products.filter((p) =>
    p.category?.toLowerCase() === 'long kurtis' || p.category?.toLowerCase() === 'long kurtas'
  ));
  const kurtiSetsAndCoords = sortList(products.filter((p) =>
    p.category?.toLowerCase() === 'kurti sets' ||
    p.category?.toLowerCase() === 'kurta sets' ||
    p.category?.toLowerCase() === 'co-ord sets'
  ));

  // Custom categories added by admin outside the core 4
  const standardCats = ['short kurtis', 'ethnic bottoms', 'bottoms', 'long kurtis', 'long kurtas', 'kurti sets', 'kurta sets', 'co-ord sets'];
  const customCatNames = Array.from(new Set(
    products
      .map((p) => p.category)
      .filter((c) => c && !standardCats.includes(c.toLowerCase()))
  ));

  // When a specific category tab is active
  const filteredTabProducts = sortList(products.filter((item) => {
    if (activeTab === 'all') return true;
    const itemCat = item.category?.toLowerCase() || '';
    const active = activeTab.toLowerCase();
    if (itemCat === active) return true;
    if (active === 'long kurtis' && itemCat === 'long kurtas') return true;
    if (active === 'kurti sets' && itemCat === 'kurta sets') return true;
    return false;
  }));

  return (
    <section id="catalog" className="py-20 bg-brand-bg scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-brand-border/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sand text-brand-primary text-[10px] uppercase tracking-[0.25em] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Kurtis, Tops & Matching Bottoms</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-brand-dark tracking-tight">
              The Kurti & Bottoms Studio
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-brand-muted max-w-sm mt-3 md:mt-0 font-light">
            Every kurti is cut from pure Jaipur mulmul cotton, tailored for everyday poise and effortless pairing.
          </p>
        </div>

        {/* Filter Tabs & Sorting Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Pills Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-brand-dark text-white shadow-md'
                    : 'bg-white hover:bg-brand-sand/50 text-brand-dark border border-brand-border/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <span className="text-xs text-brand-muted uppercase tracking-wider font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-brand-border rounded-full px-4 py-2 text-xs font-medium text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer shadow-2xs"
            >
              <option value="featured">Featured Runway</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Patron Rated</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && products.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-brand-muted">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary mb-3" />
            <p className="text-xs uppercase tracking-widest font-semibold">Loading Kurti Collection...</p>
          </div>
        ) : activeTab === 'all' ? (
          /* ============================================================== */
          /* ALL SILHOUETTES: 4 DIVERSE ROWS OF 4 (MAX ~16-20 ON SCREEN)    */
          /* EACH ROW AUTO-SCROLLS HORIZONTALLY FROM LEFT TO RIGHT          */
          /* ============================================================== */
          <div className="space-y-6">
            {/* ROW 1: Short Kurtis & Tops (4 visible, auto-scrolls to next items) */}
            {shortKurtis.length > 0 && (
              <AutoScrollShelf
                title="Trending Short Kurtis & Tops"
                subtitle="Chic casual silhouettes, handblock prints & everyday cropped tunics"
                badge="Trending Tops"
                products={shortKurtis}
                autoScrollDelay={4000}
              />
            )}

            {/* ROW 2: Ethnic Bottoms, Jeans & Palazzos (4 visible, auto-scrolls) */}
            {ethnicBottoms.length > 0 && (
              <AutoScrollShelf
                title="Ethnic Bottoms, Jeans & Palazzos"
                subtitle="High-waist straight fit denim, linen trousers & flared twirl palazzos"
                badge="All-Day Ease"
                products={ethnicBottoms}
                autoScrollDelay={4600}
              />
            )}

            {/* ROW 3: Long Kurtis & Flared Gowns (4 visible, auto-scrolls) */}
            {longKurtis.length > 0 && (
              <AutoScrollShelf
                title="Flared Gowns & Long Kurtis"
                subtitle="Flowing georgette embroidered gowns, kalidar long kurtis & timeless charm"
                badge="Celebration Privé"
                products={longKurtis}
                autoScrollDelay={5200}
              />
            )}

            {/* ROW 4: Kurti Sets & Co-ord Duos (4 visible, auto-scrolls) */}
            {kurtiSetsAndCoords.length > 0 && (
              <AutoScrollShelf
                title="Festive Kurti Sets & Matching Duos"
                subtitle="Artisanal 2 & 3 piece coordinated kurti-pant sets & contemporary duos"
                badge="Festive Pairs"
                products={kurtiSetsAndCoords}
                autoScrollDelay={5800}
              />
            )}

            {/* Additional Custom Categories if Admin adds new ones */}
            {customCatNames.map((catName, idx) => {
              const customItems = sortList(products.filter((p) => p.category === catName));
              return (
                <AutoScrollShelf
                  key={catName}
                  title={catName}
                  subtitle={`Handcrafted ${catName} collection`}
                  badge="Studio Pick"
                  products={customItems}
                  autoScrollDelay={4500 + idx * 500}
                />
              );
            })}
          </div>
        ) : (
          /* ============================================================== */
          /* FILTERED CATEGORY VIEW: AUTO-SCROLLING 4-CARD SHELF           */
          /* ============================================================== */
          <div>
            <AutoScrollShelf
              title={`${activeTab} Collection`}
              subtitle={`Showing handcrafted designs for ${activeTab}`}
              badge="Curated"
              products={filteredTabProducts}
              autoScrollDelay={4500}
            />
          </div>
        )}

      </div>
    </section>
  );
}
