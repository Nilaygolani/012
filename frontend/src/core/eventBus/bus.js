// Decoupled Event Bus for Plug-and-Play Module Communication
class EventBus {
  constructor() {
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(callback);

    return () => {
      const handlers = this.events.get(event);
      if (handlers) {
        handlers.delete(callback);
        if (handlers.size === 0) {
          this.events.delete(event);
        }
      }
    };
  }

  emit(event, data) {
    if (!this.events.has(event)) return;
    this.events.get(event).forEach((callback) => {
      try {
        callback(data);
      } catch (err) {
        console.warn(`[EventBus] Error handling event "${event}":`, err);
      }
    });
  }

  clear() {
    this.events.clear();
  }
}

export const eventBus = new EventBus();

// Standard event keys
export const EVENTS = {
  // Navigation & Page Views
  VIEW_PRODUCT_DETAIL: 'product:view_detail',
  BACK_TO_HOME: 'nav:home',
  OPEN_PATRON_CARE: 'patron_care:open',
  CLOSE_PATRON_CARE: 'patron_care:close',

  // Cart & Wishlist
  OPEN_CART: 'cart:open',
  CLOSE_CART: 'cart:close',
  ADD_TO_CART: 'cart:add',
  OPEN_WISHLIST: 'wishlist:open',
  TOGGLE_WISHLIST: 'wishlist:toggle',

  // Search & Modals
  OPEN_SEARCH: 'search:open',
  CLOSE_SEARCH: 'search:close',
  OPEN_QUICK_VIEW: 'quickview:open',

  // Auth & User Profile
  OPEN_AUTH_MODAL: 'auth:open_modal',
  CLOSE_AUTH_MODAL: 'auth:close_modal',
  OPEN_USER_ACCOUNT: 'user:open_account',
  CLOSE_USER_ACCOUNT: 'user:close_account',
  OPEN_REVIEW_MODAL: 'review:open_modal',

  // Admin Panel
  OPEN_ADMIN_PANEL: 'admin:open',
  CLOSE_ADMIN_PANEL: 'admin:close',

  // Catalog & Reels
  REFRESH_CATALOG: 'catalog:refresh',
  FILTER_CATEGORY: 'catalog:filter_category',
  REFRESH_REELS: 'reels:refresh'
};
