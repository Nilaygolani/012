import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Eye } from 'lucide-react';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';
import { API_BASE_URL } from '../../../config/api';

const SUGGESTIONS = ['Short Kurtis', 'Cotton Kurtis', 'Kurti Sets', 'Linen Pants', 'Palazzos', 'Co-ord Sets'];

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const unbindOpen = eventBus.on(EVENTS.OPEN_SEARCH, () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
      fetch(`${API_BASE_URL}/api/products`)
        .then(r => r.json())
        .then(d => setProducts(d.products || []))
        .catch(() => {});
    });
    const unbindClose = eventBus.on(EVENTS.CLOSE_SEARCH, () => setIsOpen(false));

    return () => {
      unbindOpen?.();
      unbindClose?.();
    };
  }, []);

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          (p.craft && p.craft.toLowerCase().includes(query.toLowerCase())) ||
          (p.fabric && p.fabric.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleProductClick = (product) => {
    setIsOpen(false);
    eventBus.emit(EVENTS.VIEW_PRODUCT_DETAIL, product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsOpen(false)} />

      <div className="relative max-w-3xl mx-auto mt-16 sm:mt-24 px-4 z-10 animate-scaleUp">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-brand-border">
          <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-brand-border bg-brand-bg/50">
            <Search className="w-5 h-5 text-brand-primary shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search handcrafted short kurtis, kurti sets, pants, fabrics..."
              className="flex-1 bg-transparent text-sm sm:text-base font-medium text-brand-dark placeholder-brand-muted/70 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-brand-muted hover:text-brand-dark px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-brand-dark/70 hover:text-brand-dark rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!query && (
            <div className="p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted block mb-2.5">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs px-3 py-1.5 rounded-full bg-brand-sand/50 hover:bg-brand-primary hover:text-white text-brand-dark transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && (
            <div className="max-h-96 overflow-y-auto p-4 space-y-2">
              <div className="text-xs text-brand-muted px-2 pb-1 font-medium">
                Found {results.length} styles for "{query}"
              </div>

              {results.length === 0 ? (
                <div className="py-8 text-center text-brand-muted text-xs">
                  No styles matched your search. Try searching for "Short Kurti", "Pants", or "Mulmul".
                </div>
              ) : (
                results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleProductClick(item)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-bg transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-cover object-top rounded-lg bg-brand-sand/50"
                      />
                      <div>
                        <h6 className="font-serif text-sm font-medium text-brand-dark group-hover:text-brand-primary transition-colors">
                          {item.name}
                        </h6>
                        <span className="text-[11px] text-brand-muted">
                          {item.category} &bull; {item.fabric}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-brand-dark">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <Eye className="w-4 h-4 text-brand-muted group-hover:text-brand-primary" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
