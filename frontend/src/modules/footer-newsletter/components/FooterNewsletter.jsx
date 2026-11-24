import React, { useState } from 'react';
import { Mail, CheckCircle2, Instagram, Facebook, Twitter, Phone, MapPin } from 'lucide-react';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';

export default function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  const handleCategoryClick = (catName) => {
    eventBus.emit(EVENTS.BACK_TO_HOME);
    eventBus.emit(EVENTS.FILTER_CATEGORY, catName);
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePatronCareClick = (tab) => {
    eventBus.emit(EVENTS.OPEN_PATRON_CARE, { tab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-dark text-white pt-10 sm:pt-16 pb-8 sm:pb-12 border-t border-brand-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-10 mb-10 sm:mb-14 text-center max-w-3xl mx-auto">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Join The Nailmores Circle
          </span>
          <h3 className="font-serif text-xl sm:text-3xl font-normal text-white mt-1 mb-2">
            Enjoy Flat ₹200 Off on Your Maiden Order
          </h3>
          <p className="text-xs sm:text-sm text-brand-sand/70 max-w-md mx-auto mb-5 sm:mb-6 font-light">
            Be the first to explore limited kurti drops, seasonal handblocks, and private secret sales.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 px-4 py-2.5 rounded-full text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>You're in! Use coupon code <strong>NAIL200</strong> at checkout.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-full pl-10 pr-4 py-2.5 sm:py-3 text-xs text-white placeholder-brand-sand/50 focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
                <Mail className="w-4 h-4 text-brand-sand/50 absolute left-3.5 top-3 sm:top-3.5" />
              </div>
              <button
                type="submit"
                className="bg-brand-primary hover:bg-brand-primaryDark text-white px-6 py-2.5 sm:py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 pb-8 sm:pb-12 border-b border-white/10">
          <div className="lg:col-span-2 space-y-4">
            <div className="text-left">
              <span className="font-serif text-2xl tracking-[0.18em] font-medium text-white uppercase">
                nailmores
              </span>
              <div className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-sans font-medium mt-0.5">
                Pure Kurti & Sets Studio &bull; Jaipur
              </div>
            </div>
            <p className="text-xs text-brand-sand/70 leading-relaxed font-light max-w-sm">
              Handcrafted women's kurtis, tunics, matching pants, and everyday co-ords crafted with 100% breathable Jaipur mulmul cotton.
            </p>
            <div className="flex items-center gap-3 pt-2 text-brand-sand/80">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-primary flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-primary flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-primary flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-serif text-sm uppercase tracking-widest text-brand-gold font-semibold mb-4">
              Kurti Collections
            </h5>
            <ul className="space-y-2 text-xs text-brand-sand/70">
              <li><button onClick={() => handleCategoryClick('Short Kurtis')} className="hover:text-white transition-colors">Short Kurtis & Tunics</button></li>
              <li><button onClick={() => handleCategoryClick('Long Kurtis')} className="hover:text-white transition-colors">Long A-Line Kurtis</button></li>
              <li><button onClick={() => handleCategoryClick('Kurti Sets')} className="hover:text-white transition-colors">3-Piece Kurti Sets</button></li>
              <li><button onClick={() => handleCategoryClick('Ethnic Bottoms')} className="hover:text-white transition-colors">Linen Pants & Palazzos</button></li>
              <li><button onClick={() => handleCategoryClick('Co-ord Sets')} className="hover:text-white transition-colors">Matching Co-ord Sets</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-sm uppercase tracking-widest text-brand-gold font-semibold mb-4">
              Patron Care
            </h5>
            <ul className="space-y-2 text-xs text-brand-sand/70">
              <li>
                <button
                  onClick={() => handlePatronCareClick('tracking')}
                  className="hover:text-white transition-colors text-left"
                >
                  Live Order Tracking (AWB)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePatronCareClick('exchange')}
                  className="hover:text-white transition-colors text-left"
                >
                  7-Day Sizing Exchange
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePatronCareClick('shipping')}
                  className="hover:text-white transition-colors text-left"
                >
                  Shipping Information
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePatronCareClick('sizing')}
                  className="hover:text-white transition-colors text-left"
                >
                  Size Guide & Fit Tips
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-sm uppercase tracking-widest text-brand-gold font-semibold mb-4">
              Atelier Contact
            </h5>
            <div className="space-y-2.5 text-xs text-brand-sand/70">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>Sanganer Handblock Studio, Jaipur, Rajasthan 302029</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>+91 7567540190</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>nailmores.in@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-sand/60 gap-3 sm:gap-4 text-center sm:text-left">
          <div>
            &copy; {new Date().getFullYear()} <strong>nailmores</strong>. All rights reserved. Handcrafted in India.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-brand-sand/80">
            <span>Razorpay Secure Online</span>
            <span>&bull;</span>
            <span>UPI</span>
            <span>&bull;</span>
            <span>Cards</span>
            <span>&bull;</span>
            <span>NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
