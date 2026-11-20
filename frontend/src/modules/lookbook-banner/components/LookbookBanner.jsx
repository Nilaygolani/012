import React, { useState } from 'react';
import { ArrowRight, Sparkles, Plus, Eye, ShoppingBag, Check, Layers, Compass } from 'lucide-react';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';

export default function LookbookBanner() {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [activePinId, setActivePinId] = useState(1);

  const looks = [
    {
      id: 'look-1',
      title: 'White Floral Cotton Co-Ord Set with Kurti & Palazzos',
      subtitle: 'Trending Duo • Co-Ord Drop',
      productId: 'prod-1794568830962',
      price: 449,
      image: 'https://images.meesho.com/images/products/1096061321/8kuz6_512.avif?width=512',
      description: 'Artisanal white co-ord ensemble crafted in breathable cotton featuring delicate floral sprigs, graceful square neckline, elegant side drawstring tie-ups, and coordinated wide-leg palazzos.',
      fabric: '100% Pure Jaipur Mulmul Cotton',
      craft: 'Floral Handblock Print & Side Tie Strings',
      hotspots: [
        {
          id: 1,
          x: '50%',
          y: '36%',
          title: 'Square Neckline with Floral Butis',
          subtitle: 'Modern flattering neckline',
          detail: 'Crisp tailored square neck framed with delicate hand-printed pink floral sprigs on breathable white mulmul.'
        },
        {
          id: 2,
          x: '56%',
          y: '58%',
          title: 'Adjustable Side Corset Tie-ups',
          subtitle: 'Cinched contour styling',
          detail: 'Functional side drawstrings allow you to adjust the fit around your waist for effortless twirl and poise.'
        },
        {
          id: 3,
          x: '46%',
          y: '82%',
          title: 'Matching Flared Palazzos',
          subtitle: 'All-day airy movement',
          detail: 'Featherweight matching flared trousers that move effortlessly with every step.'
        }
      ]
    },
    {
      id: 'look-2',
      title: "Pink Faux Georgette Embroidered Flared Gown",
      subtitle: 'Festive Heirloom Drop',
      productId: 'prod-001',
      price: 649,
      image: 'https://images.meesho.com/images/products/312631324/xsuvb_512.avif?width=512',
      description: 'Floor-length flared gown kurti crafted in delicate pink georgette accented with shimmering multithreaded Resham and micro-sequin embroidery.',
      fabric: '100% Breathable Cotton & Faux Georgette',
      craft: 'Multithreaded Embroidered & Floral Resham',
      hotspots: [
        {
          id: 1,
          x: '50%',
          y: '30%',
          title: 'Multithreaded Floral & Sequin Yoke',
          subtitle: 'Subtle festive shimmer',
          detail: 'Fine metallic micro-sequins embroidered with tonal threads for sophisticated festive luster.'
        },
        {
          id: 2,
          x: '52%',
          y: '76%',
          title: 'Full Volume Flared Gown Hem',
          subtitle: 'Regal kalidar drape',
          detail: 'Wide sweep flare that twirls effortlessly for celebrations, wedding sangeets, and evening soirees.'
        }
      ]
    },
    {
      id: 'look-3',
      title: 'White Floral Twirl Motion Angle',
      subtitle: 'Atelier Try-On Drop',
      productId: 'prod-1794568830962',
      price: 449,
      image: 'https://images.meesho.com/images/products/1096061321/162qa_512.avif?width=512',
      description: 'Effortless coordinated matching tunic and ankle-length pants. Look instantly styled without spending time matching bottoms.',
      fabric: '100% Pure Jaipur Mulmul Cotton',
      craft: 'Floral Handblock Print & Side Ties',
      hotspots: [
        {
          id: 1,
          x: '48%',
          y: '34%',
          title: 'Tailored Square Cut Yoke',
          subtitle: 'Clean tailored silhouette',
          detail: 'Precision cut yoke with feminine floral placement printing on airy cotton fabric.'
        },
        {
          id: 2,
          x: '54%',
          y: '80%',
          title: 'Flared Ankle-Length Pants',
          subtitle: 'Easy slip-on comfort',
          detail: 'Designed to flatter all body types with relaxed ease and elegant ankle-crop drape.'
        }
      ]
    }
  ];

  const currentLook = looks[activeLookIndex];
  const activeSpot = currentLook.hotspots.find(h => h.id === activePinId) || currentLook.hotspots[0];

  const handleOpenProduct = (productId) => {
    eventBus.emit(EVENTS.VIEW_PRODUCT_DETAIL, productId);
  };

  return (
    <section id="lookbook" className="py-12 sm:py-24 luxury-gradient text-white relative overflow-hidden scroll-mt-20">
      {/* Background radial ambient highlights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header & Look Selector Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-brand-gold text-[10px] uppercase tracking-[0.25em] font-semibold border border-brand-gold/30 mb-2 sm:mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Runway Lookbook</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-5xl font-normal leading-[1.15] sm:leading-[1.12]">
              Sculpted for poise, twirled in poetry.
            </h2>
          </div>

          {/* Look Switcher Pills (Horizontal scroll on mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
            {looks.map((look, idx) => (
              <button
                key={look.id}
                onClick={() => {
                  setActiveLookIndex(idx);
                  setActivePinId(1);
                }}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 sm:gap-2 ${
                  activeLookIndex === idx
                    ? 'bg-brand-primary text-white shadow-lg ring-2 ring-brand-gold/40'
                    : 'bg-white/10 hover:bg-white/20 text-brand-sand border border-white/10'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <span>Look 0{idx + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lookbook Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Left: Runway Image with Hotspots */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-brand-dark/40 group">
              <img
                src={currentLook.image}
                alt={currentLook.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

              {/* Hotspot Pins */}
              {currentLook.hotspots.map((pin) => (
                <div
                  key={pin.id}
                  style={{ top: pin.y, left: pin.x }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                >
                  <button
                    onClick={() => setActivePinId(pin.id)}
                    className={`relative w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                      activePinId === pin.id
                        ? 'bg-brand-primary text-white scale-110 shadow-2xl ring-2 sm:ring-4 ring-brand-gold/60'
                        : 'bg-white/90 hover:bg-white text-brand-dark shadow-lg'
                    }`}
                    aria-label={pin.title}
                  >
                    <span className="absolute inset-0 rounded-full bg-brand-primary/40 animate-ping" />
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 transition-transform hover:rotate-90" />
                  </button>
                </div>
              ))}

              {/* Bottom Model Tag & Hint */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between text-xs text-brand-sand/90 bg-black/40 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Compass className="w-3.5 h-3.5 text-brand-gold animate-spin shrink-0" style={{ animationDuration: '8s' }} />
                  <span className="text-[10px] sm:text-[11px] font-medium">Tap glowing pins to inspect bespoke tailoring</span>
                </div>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-brand-gold tracking-widest hidden sm:inline">
                  {currentLook.subtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Bespoke Craft Breakdown & Quick Ensemble Buy */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-2">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-brand-gold font-bold">
                {currentLook.subtitle}
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-normal leading-tight">
                {currentLook.title}
              </h3>
              <p className="text-xs sm:text-sm text-brand-sand/80 font-light leading-relaxed pt-1">
                {currentLook.description}
              </p>
            </div>

            {/* Active Hotspot Macro Detail Card */}
            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md transition-all">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-brand-gold font-bold flex items-center gap-1.5">
                  <Layers className="w-3 h-3" />
                  <span>Tailoring Detail #{activeSpot.id}</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-brand-sand/70 font-sans">Handcrafted</span>
              </div>
              <h4 className="font-serif text-sm sm:text-lg font-medium text-white">
                {activeSpot.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-brand-sand/80 mt-1 leading-relaxed">
                {activeSpot.detail}
              </p>
            </div>

            {/* Atelier Craft Tags */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-brand-gold font-bold block">Fabric</span>
                <span className="text-brand-sand font-medium text-[11px] sm:text-xs mt-0.5 block">{currentLook.fabric}</span>
              </div>
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-brand-gold font-bold block">Artisan Craft</span>
                <span className="text-brand-sand font-medium text-[11px] sm:text-xs mt-0.5 block">{currentLook.craft}</span>
              </div>
            </div>

            {/* Action Bar: Direct Silhouette Link & Catalog Browse */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => handleOpenProduct(currentLook.productId)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-sand hover:bg-white text-brand-dark px-5 py-3.5 sm:px-6 sm:py-4 rounded-full text-xs font-semibold uppercase tracking-[0.16em] transition-all shadow-lg hover:shadow-2xl hover:scale-102 text-center"
              >
                <Eye className="w-4 h-4 text-brand-primary" />
                <span>View Full Silhouette (₹{currentLook.price.toLocaleString('en-IN')})</span>
              </button>
              
              <a
                href="#catalog"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 sm:px-6 sm:py-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors text-center"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
