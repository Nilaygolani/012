import React, { useState } from 'react';
import { ArrowRight, Sparkles, Star, ShieldCheck, Heart, ShoppingBag, Eye } from 'lucide-react';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';

export default function HeroSlider() {
  const [activeTab, setActiveTab] = useState(0);

  const heroDrops = [
    {
      title: "White Floral Mulmul Co-Ord Symphony",
      subtitle: "Jaipur Atelier • New Arrival Drop",
      description: "Pure white cotton mulmul co-ord silhouette hand-printed with delicate floral motifs, modern square neckline, and flattering side drawstring tie-ups. Includes matching wide-leg palazzos.",
      cta: "Shop Co-Ord Set",
      badge: "New Arrival Drop",
      featuredProduct: {
        id: "prod-1794568830962",
        name: "White Floral Cotton Co-Ord Set",
        price: 449,
        rating: 5.0,
        image: "https://images.meesho.com/images/products/1096061321/8kuz6_512.avif?width=512"
      },
      heroImage: "https://images.meesho.com/images/products/1096061321/8kuz6_512.avif?width=512"
    },
    {
      title: "Pink Sequins Embroidered Flared Gown",
      subtitle: "Celebration Privé • Spring Festive Drop",
      description: "Floor-length flared gown kurti crafted in delicate faux georgette accented with multithreaded floral Resham and glistening micro-sequin embroidery.",
      cta: "View Gown Kurti",
      badge: "Festive Bestseller",
      featuredProduct: {
        id: "prod-001",
        name: "Pink Georgette Embroidered Flared Gown",
        price: 649,
        rating: 4.9,
        image: "https://images.meesho.com/images/products/312631324/xsuvb_512.avif?width=512"
      },
      heroImage: "https://images.meesho.com/images/products/312631324/xsuvb_512.avif?width=512"
    }
  ];

  const current = heroDrops[activeTab];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-sand/30 via-brand-bg to-brand-bg pt-6 pb-16 lg:pt-10 lg:pb-24">
      {/* Subtle Luxury Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Magazine Typography & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-border/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping"></span>
              <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-brand-dark">
                {current.badge}
              </span>
              <span className="text-brand-gold font-serif italic text-xs">&mdash; Privé Collection</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-brand-dark">
              Grace woven into <span className="italic font-light text-brand-primary">modern poetry.</span>
            </h1>

            <p className="text-sm sm:text-base text-brand-muted leading-relaxed font-light max-w-lg">
              {current.description}
            </p>

            {/* CTAs & Micro Trust Pill */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 bg-brand-dark hover:bg-brand-primary text-white px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 shadow-md hover:shadow-xl hover:translate-x-0.5 group"
              >
                <span>{current.cta}</span>
                <ArrowRight className="w-4 h-4 text-brand-gold group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#lookbook"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white hover:bg-brand-sand/50 border border-brand-border text-brand-dark text-xs font-semibold uppercase tracking-[0.16em] transition-all"
              >
                <span>Runway Lookbook</span>
              </a>
            </div>

            {/* Social Proof Bar */}
            <div className="pt-4 flex items-center gap-6 border-t border-brand-border/60">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-brand-dark">4.9/5</span>
                <span className="text-[11px] text-brand-muted">(2,400+ reviews)</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-brand-border"></span>
              <div className="flex items-center gap-1 text-[11px] text-brand-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Verified Jaipur Silk & Cotton</span>
              </div>
            </div>
          </div>

          {/* Right: Architectural Image Frame with Floating Glass Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={current.heroImage}
                alt={current.title}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">
                  {current.subtitle}
                </span>
                <h3 className="font-serif text-2xl font-normal leading-snug mt-0.5">
                  {current.title}
                </h3>
              </div>
            </div>

            {/* Floating Glassmorphic Product Card */}
            <div className="absolute left-3 bottom-3 sm:-bottom-8 sm:-left-8 glass-card p-2.5 sm:p-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 sm:gap-3.5 max-w-[280px] sm:max-w-xs backdrop-blur-md bg-white/95 border border-white/80 animate-fadeIn hover:scale-105 transition-transform cursor-pointer"
                 onClick={() => {
                   eventBus.emit(EVENTS.VIEW_PRODUCT_DETAIL, current.featuredProduct.id);
                 }}
            >
              <img
                src={current.featuredProduct.image}
                alt={current.featuredProduct.name}
                className="w-12 h-14 sm:w-14 sm:h-16 object-cover rounded-xl bg-brand-sand shrink-0 shadow-xs"
              />
              <div className="text-xs">
                <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{current.featuredProduct.rating} Bestseller</span>
                </div>
                <h5 className="font-serif font-medium text-brand-dark line-clamp-1 mt-0.5 text-xs sm:text-sm">
                  {current.featuredProduct.name}
                </h5>
                <span className="text-xs sm:text-sm font-bold text-brand-primary font-sans">
                  ₹{current.featuredProduct.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Floating Switch Tabs */}
            <div className="absolute top-4 right-4 flex gap-1.5 glass-card p-1.5 rounded-full">
              {heroDrops.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`h-2 transition-all rounded-full ${
                    i === activeTab ? 'w-6 bg-brand-primary' : 'w-2 bg-brand-dark/30 hover:bg-brand-dark/60'
                  }`}
                  aria-label={`Switch to drop ${i + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
