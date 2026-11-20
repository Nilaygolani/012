import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Quote, MessageSquarePlus, Sparkles } from 'lucide-react';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';
import { useAuthStore } from '../../../core/auth/authStore';
import { API_BASE_URL } from '../../../config/api';

export default function CustomerTestimonials() {
  const [reviews, setReviews] = useState([]);
  const { user } = useAuthStore();

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.warn('[Reviews] Backend not reached');
    }
  };

  useEffect(() => {
    fetchReviews();
    const unbind = eventBus.on('reviews:refresh', fetchReviews);
    return () => unbind?.();
  }, []);

  const handleWriteReview = () => {
    if (user) {
      eventBus.emit(EVENTS.OPEN_REVIEW_MODAL);
    } else {
      eventBus.emit(EVENTS.OPEN_AUTH_MODAL);
    }
  };

  return (
    <section className="py-20 bg-white border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.25em] uppercase text-brand-primary mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Patron Testimonials</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-brand-dark">
              Words from Our Patrons
            </h3>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-1.5 bg-brand-sand/40 px-3.5 py-1.5 rounded-full border border-brand-border">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-brand-dark">4.9 / 5</span>
              <span className="text-[11px] text-brand-muted">(25,000+ happy patrons)</span>
            </div>

            <button
              onClick={handleWriteReview}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-brand-gold" />
              <span>Write Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((review) => (
            <div
              key={review.id}
              className="p-7 rounded-2xl bg-brand-bg/70 border border-brand-border hover:border-brand-primary/40 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-500">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-brand-sand stroke-1 fill-current" />
                </div>

                <p className="text-xs sm:text-sm text-brand-dark/90 leading-relaxed font-light mb-6">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-brand-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-sm text-brand-dark">
                      {review.userName || 'Verified Patron'}
                    </span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-[10px] text-brand-muted uppercase tracking-wider">
                    Verified Order
                  </span>
                </div>
                {review.productName && (
                  <p className="text-[11px] text-brand-primary font-medium mt-1 truncate">
                    {review.productName}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
