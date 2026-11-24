import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, User, ShieldAlert, LogOut, Package } from 'lucide-react';
import Logo from '../../../core/branding/Logo';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';
import { useAuthStore } from '../../../core/auth/authStore';

export default function HeaderNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 25);
    window.addEventListener('scroll', handleScroll);

    const unbindCart = eventBus.on('cart:update_count', (count) => setCartCount(count));
    const unbindWishlist = eventBus.on('wishlist:update_count', (count) => setWishlistCount(count));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unbindCart?.();
      unbindWishlist?.();
    };
  }, []);

  const navLinks = [
    { name: 'Short Kurtis', category: 'Short Kurtis' },
    { name: 'Long Kurtis', category: 'Long Kurtis' },
    { name: 'Kurti Sets', category: 'Kurti Sets' },
    { name: 'Ethnic Bottoms', category: 'Ethnic Bottoms' },
    { name: 'Co-ord Sets', category: 'Co-ord Sets' }
  ];

  const handleCategoryClick = (catName) => {
    eventBus.emit(EVENTS.BACK_TO_HOME);
    eventBus.emit(EVENTS.FILTER_CATEGORY, catName);
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    eventBus.emit(EVENTS.BACK_TO_HOME);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Smart User Button Handler:
  const handleUserButtonClick = () => {
    if (!user) {
      // Guest -> Open Login / Register
      eventBus.emit(EVENTS.OPEN_AUTH_MODAL);
    } else if (user.role === 'admin') {
      // Admin -> Toggle Admin Menu
      setAdminDropdownOpen(!adminDropdownOpen);
    } else {
      // Normal Customer -> Open User Profile & Order Tracking directly!
      eventBus.emit(EVENTS.OPEN_USER_ACCOUNT);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-30 transition-all duration-500 ${
          isScrolled
            ? 'glass-header py-3 shadow-sm'
            : 'bg-brand-bg/90 backdrop-blur-md py-4 border-b border-brand-border/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Mobile Toggle & Search */}
            <div className="flex items-center gap-1 sm:gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 sm:p-2 text-brand-dark hover:text-brand-primary -ml-1 sm:-ml-2 rounded-full hover:bg-white/80 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                onClick={() => eventBus.emit(EVENTS.OPEN_SEARCH)}
                className="hidden sm:flex items-center gap-2.5 text-xs tracking-wider uppercase py-2 px-4 rounded-full bg-white/70 hover:bg-white border border-brand-border/70 hover:border-brand-primary/40 text-brand-dark transition-all duration-300 shadow-2xs"
              >
                <Search className="w-3.5 h-3.5 text-brand-primary" />
                <span className="font-medium text-[11px] text-brand-muted">Search Kurtis & Sets</span>
                <kbd className="hidden md:inline text-[9px] bg-brand-sand/50 text-brand-muted px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
              </button>
            </div>

            {/* Center: Brand Logo */}
            <div className="flex-1 lg:flex-initial text-center lg:text-left px-1">
              <div onClick={handleLogoClick} className="inline-block cursor-pointer">
                <Logo size="md" showTagline={!isScrolled} />
              </div>
            </div>

            {/* Right: Actions Cluster (User Profile / Sign In, Wishlist, Bag) */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                onClick={() => eventBus.emit(EVENTS.OPEN_SEARCH)}
                className="sm:hidden p-1.5 text-brand-dark hover:text-brand-primary rounded-full hover:bg-white/80 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* User Account / Sign In Button */}
              <div className="relative">
                <button
                  onClick={handleUserButtonClick}
                  className="flex items-center gap-1.5 p-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-white border border-transparent hover:border-brand-border/70 text-brand-dark hover:text-brand-primary transition-all text-xs"
                  title={user ? (user.role === 'admin' ? 'Admin Menu' : 'My Account & Orders') : 'Sign In'}
                >
                  <div className="w-7 h-7 rounded-full bg-brand-sand/60 flex items-center justify-center text-brand-dark border border-brand-border">
                    <User className="w-3.5 h-3.5 stroke-[1.8]" />
                  </div>
                  <span className="hidden sm:inline font-semibold text-[11px] uppercase tracking-wider">
                    {user ? user.name.split(' ')[0] : 'Sign In'}
                  </span>
                </button>

                {/* Dropdown ONLY for Admin */}
                {adminDropdownOpen && user && user.role === 'admin' && (
                  <div
                    className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-2xl py-2 z-50 animate-scaleUp text-xs"
                    onMouseLeave={() => setAdminDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-brand-border/60 bg-brand-sand/20">
                      <p className="font-semibold text-brand-dark">{user.name}</p>
                      <span className="inline-block mt-0.5 text-[9px] bg-brand-primary text-white px-2 py-0.2 rounded-full font-bold uppercase tracking-wider">
                        Administrator
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setAdminDropdownOpen(false);
                        eventBus.emit(EVENTS.OPEN_ADMIN_PANEL);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-brand-sand/40 flex items-center gap-2 text-brand-primaryDark font-semibold transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4 text-brand-primary" />
                      <span>Admin Management Console</span>
                    </button>

                    <button
                      onClick={() => {
                        setAdminDropdownOpen(false);
                        eventBus.emit(EVENTS.OPEN_USER_ACCOUNT);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-brand-sand/40 flex items-center gap-2 text-brand-dark font-medium transition-colors"
                    >
                      <Package className="w-4 h-4 text-brand-primary" />
                      <span>Orders & Live Tracking</span>
                    </button>

                    <div className="border-t border-brand-border/60 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setAdminDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => eventBus.emit(EVENTS.OPEN_WISHLIST)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 hover:bg-white border border-brand-border/70 flex items-center justify-center text-brand-dark hover:text-brand-primary transition-all relative shrink-0"
                title="Wishlist"
              >
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Bag Button */}
              <button
                onClick={() => eventBus.emit(EVENTS.OPEN_CART)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-dark hover:bg-brand-primary text-white transition-all duration-300 shadow-md group shrink-0"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-sand" />
                <span className="text-xs font-semibold tracking-wider font-mono">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Categories */}
          <nav className="hidden lg:flex items-center justify-center gap-8 mt-3 pt-3 border-t border-brand-border/40">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleCategoryClick(link.category)}
                className="text-xs uppercase tracking-[0.16em] font-medium text-brand-dark/80 hover:text-brand-primary transition-colors relative group py-1"
              >
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <a
              href="#lookbook"
              onClick={() => {
                eventBus.emit(EVENTS.BACK_TO_HOME);
              }}
              className="text-xs uppercase tracking-[0.16em] font-medium text-brand-gold hover:text-brand-primary transition-colors py-1"
            >
              Runway Lookbook
            </a>
            <button
              onClick={() => {
                eventBus.emit(EVENTS.OPEN_PATRON_CARE, { tab: 'tracking' });
              }}
              className="text-xs uppercase tracking-[0.16em] font-medium text-brand-dark/80 hover:text-brand-primary transition-colors py-1"
            >
              Patron Care
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col z-10 animate-slideRight">
            <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-bg/50">
              <Logo size="sm" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-brand-dark/70 hover:text-brand-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-1">
              <div className="text-[10px] uppercase font-bold text-brand-muted tracking-widest px-3 pt-2 pb-1">
                Curated Silhouettes
              </div>
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleCategoryClick(link.category)}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-brand-dark hover:bg-brand-sand/40 hover:text-brand-primary text-left transition-colors"
                >
                  <span>{link.name}</span>
                </button>
              ))}

              <div className="pt-4 border-t border-brand-border/60 space-y-1">
                <div className="text-[10px] uppercase font-bold text-brand-primary tracking-widest px-3 pb-1">
                  Patron Care & Concierge
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    eventBus.emit(EVENTS.OPEN_PATRON_CARE, { tab: 'tracking' });
                  }}
                  className="w-full flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-medium text-brand-dark hover:bg-brand-sand/40 text-left transition-colors"
                >
                  <Package className="w-4 h-4 text-brand-primary" />
                  <span>Live Order Tracking (AWB)</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    eventBus.emit(EVENTS.OPEN_PATRON_CARE, { tab: 'exchange' });
                  }}
                  className="w-full flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-medium text-brand-dark hover:bg-brand-sand/40 text-left transition-colors"
                >
                  <span className="text-brand-primary text-sm">🔄</span>
                  <span>7-Day Sizing Exchange</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    eventBus.emit(EVENTS.OPEN_PATRON_CARE, { tab: 'sizing' });
                  }}
                  className="w-full flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-medium text-brand-dark hover:bg-brand-sand/40 text-left transition-colors"
                >
                  <span className="text-brand-primary text-sm">📏</span>
                  <span>Size Guide & Fit Tips</span>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-border space-y-2 text-xs text-brand-muted">
                <div>Client Care: <span className="font-semibold text-brand-dark">+91 75675 40190</span></div>
                <div>Atelier Email: <span className="font-semibold text-brand-dark">nailmores.in@gmail.com</span></div>
                <div className="pt-1 text-[11px] text-brand-gold font-medium">100% Mulmul Cotton &bull; Handcrafted in Jaipur</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
