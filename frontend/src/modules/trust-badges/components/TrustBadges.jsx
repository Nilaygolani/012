import React from 'react';
import { Truck, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

const PERKS = [
  {
    icon: Truck,
    title: '100% Free Express Delivery',
    desc: 'Free delivery on all items with real-time AWB courier tracking'
  },
  {
    icon: RefreshCw,
    title: '7-Day Seamless Exchange',
    desc: 'Complimentary doorstep sizing & silhouette exchange'
  },
  {
    icon: Sparkles,
    title: 'Pure Jaipur Mulmul',
    desc: 'Handblock carved wooden printing & skin-friendly dyes'
  },
  {
    icon: ShieldCheck,
    title: '100% Secure Checkout',
    desc: 'Instant encrypted online payments via UPI, Cards & NetBanking'
  }
];

export default function TrustBadges() {
  return (
    <section className="py-14 bg-brand-sand/30 border-y border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {PERKS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 group">
                <div className="w-12 h-12 rounded-2xl bg-white border border-brand-border flex items-center justify-center text-brand-primary shrink-0 shadow-2xs group-hover:bg-brand-dark group-hover:text-brand-gold group-hover:scale-105 transition-all duration-300">
                  <Icon className="w-5 h-5 stroke-[1.6]" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-brand-dark mb-0.5">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-brand-muted font-light leading-snug">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
