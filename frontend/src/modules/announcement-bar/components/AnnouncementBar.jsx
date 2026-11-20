import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

const MESSAGES = [
  { text: "Complimentary Pan-India Express Delivery on orders above ₹999", code: "FREESHIP" },
  { text: "Privé Atelier Drop: The Festive Anarkali & Mulmul Symphony", link: "#catalog" },
  { text: "Welcome Privilege: 15% Savings on Your Maiden Purchase", code: "NAIL15" },
  { text: "Instant 100% Encrypted Checkout — UPI, Cards & NetBanking (COD Disabled)", badge: "Zero Fees" }
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  const current = MESSAGES[index];

  return (
    <div className="bg-brand-dark text-white text-[11px] py-2 px-4 relative border-b border-brand-gold/20 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Status */}
        <div className="hidden lg:flex items-center gap-2 text-brand-sand/70 tracking-widest text-[10px] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Atelier Open &bull; Ships in 24 Hrs</span>
        </div>

        {/* Center Live Message */}
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <div className="inline-flex items-center gap-2 font-light tracking-wide transition-all duration-500">
            <span className="w-4 h-4 rounded-full bg-brand-primary/40 text-brand-gold flex items-center justify-center text-[10px]">
              &bull;
            </span>
            <span className="text-brand-sand">{current.text}</span>
            {current.code && (
              <span className="bg-white/10 text-brand-gold px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider border border-brand-gold/30">
                {current.code}
              </span>
            )}
          </div>
        </div>

        {/* Right Dismiss */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setVisible(false)}
            className="text-brand-sand/60 hover:text-white p-0.5 transition-colors"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
