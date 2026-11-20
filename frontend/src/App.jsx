import React, { useEffect, useState } from 'react';
import SlotRenderer from './core/slots/SlotRenderer';
import { initializeModules } from './core/slots/moduleRegistry';
import { eventBus, EVENTS } from './core/eventBus/bus';
import ProductDetailPage from './modules/product-detail/components/ProductDetailPage';
import PatronCarePage from './modules/patron-care/components/PatronCarePage';

export default function App() {
  const [activeProductId, setActiveProductId] = useState(null);
  const [activePatronCareTab, setActivePatronCareTab] = useState(null);

  useEffect(() => {
    initializeModules();

    const unbindView = eventBus.on(EVENTS.VIEW_PRODUCT_DETAIL, (prodId) => {
      setActivePatronCareTab(null);
      setActiveProductId(prodId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const unbindPatronCare = eventBus.on(EVENTS.OPEN_PATRON_CARE, (data) => {
      setActiveProductId(null);
      setActivePatronCareTab(data?.tab || 'tracking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const unbindClosePatronCare = eventBus.on(EVENTS.CLOSE_PATRON_CARE, () => {
      setActivePatronCareTab(null);
    });

    const unbindHome = eventBus.on(EVENTS.BACK_TO_HOME, () => {
      setActiveProductId(null);
      setActivePatronCareTab(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    return () => {
      unbindView?.();
      unbindPatronCare?.();
      unbindClosePatronCare?.();
      unbindHome?.();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-dark selection:bg-brand-primary/10 selection:text-brand-primary font-sans antialiased">
      {/* 1. Slot: Announcement Bar */}
      <SlotRenderer name="announcement" />

      {/* 2. Slot: Header Navigation */}
      <SlotRenderer name="header" />

      {/* Main View: Dedicated Product Detail Page OR Dedicated Patron Care Page OR Storefront Home */}
      {activeProductId ? (
        <main className="flex-1">
          <ProductDetailPage
            productId={activeProductId}
            onBack={() => setActiveProductId(null)}
          />
        </main>
      ) : activePatronCareTab ? (
        <main className="flex-1">
          <PatronCarePage
            initialTab={activePatronCareTab}
            onBack={() => setActivePatronCareTab(null)}
          />
        </main>
      ) : (
        <main className="flex-1">
          {/* 3. Slot: Hero Banner */}
          <SlotRenderer name="hero" />

          {/* 4. Slot: Category Navigation */}
          <SlotRenderer name="category-nav" />

          {/* 5. Slot: Products Catalog Showcase */}
          <SlotRenderer name="product-showcase" />

          {/* 6. Slot: Editorial Lookbook */}
          <SlotRenderer name="editorial-banner" />

          {/* 7. Slot: Customer Testimonials & Reviews */}
          <SlotRenderer name="testimonials" />

          {/* 8. Slot: Instagram Visual Shopping Grid */}
          <SlotRenderer name="instagram-feed" />

          {/* 9. Slot: Trust & Assurance Badges */}
          <SlotRenderer name="trust-badges" />
        </main>
      )}

      {/* 10. Slot: Footer & Newsletter */}
      <SlotRenderer name="footer" />

      {/* 11. Slot: Drawers, Modals & Floating UI (Cart, Wishlist, Search, Auth, User Account with Order Tracking, Admin Panel) */}
      <SlotRenderer name="drawers" />
    </div>
  );
}
