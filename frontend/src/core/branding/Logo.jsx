import React from 'react';

export default function Logo({ size = 'md', className = '', showTagline = false }) {
  const sizeClasses = {
    sm: 'text-xl tracking-[0.22em]',
    md: 'text-2xl md:text-3xl tracking-[0.24em]',
    lg: 'text-3xl md:text-4xl tracking-[0.28em]'
  };

  return (
    <div className={`inline-flex flex-col items-center select-none cursor-pointer group ${className}`}>
      <div className="flex items-center gap-2.5">
        {/* Couture Architectural Monogram */}
        <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-full bg-brand-dark flex items-center justify-center text-white shadow-md border border-brand-gold/40 group-hover:scale-105 transition-transform duration-300">
          <svg className="w-4 h-4 text-brand-gold fill-current" viewBox="0 0 24 24">
            <path d="M12 1L14.8 9.2L23 12L14.8 14.8L12 23L9.2 14.8L1 12L9.2 9.2L12 1Z" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-primary ring-2 ring-white"></span>
        </div>
        
        {/* Brand Couture Name */}
        <span className={`font-serif uppercase font-normal text-brand-dark ${sizeClasses[size] || sizeClasses.md}`}>
          nailmores
        </span>
      </div>
      {showTagline && (
        <span className="text-[9px] tracking-[0.38em] uppercase text-brand-muted font-sans font-medium mt-1">
          Couture &middot; Artisanal &middot; Atelier
        </span>
      )}
    </div>
  );
}
