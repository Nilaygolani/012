import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '../../../core/auth/authStore';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';
import Logo from '../../../core/branding/Logo';

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'register'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const { login, register, loading, error, pendingAction } = useAuthStore();

  useEffect(() => {
    const unbindOpen = eventBus.on(EVENTS.OPEN_AUTH_MODAL, () => {
      setIsOpen(true);
      setMode('login');
    });
    const unbindClose = eventBus.on(EVENTS.CLOSE_AUTH_MODAL, () => setIsOpen(false));
    return () => {
      unbindOpen?.();
      unbindClose?.();
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(email, password);
    } else {
      await register({ name, email, password, phone, address });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" onClick={() => setIsOpen(false)} />

      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden z-10 animate-scaleUp border border-brand-border">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 text-brand-dark/70 hover:text-brand-dark rounded-full hover:bg-brand-sand/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-5 sm:p-7 bg-brand-bg/60 border-b border-brand-border text-center">
          <Logo size="sm" showTagline={false} />
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-brand-dark mt-2">
            {mode === 'login' ? 'Sign In to Your Account' : 'Create Your Account'}
          </h3>
          {pendingAction === 'checkout' && (
            <div className="mt-2.5 text-[11px] sm:text-xs bg-amber-50 text-amber-800 border border-amber-200 py-1 sm:py-1.5 px-3 rounded-full font-medium inline-block">
              Please sign in to proceed with your Razorpay order.
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-7">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <div>
                <label className="block text-brand-dark font-medium mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Patel"
                    className="w-full bg-brand-bg/40 border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                  <User className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-brand-dark font-medium mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-brand-bg/40 border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                <Mail className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-brand-dark font-medium mb-1">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full bg-brand-bg/40 border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-brand-dark font-medium mb-1">Phone Number (For Order Tracking SMS)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-brand-bg/40 border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                    <Phone className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-brand-dark font-medium mb-1">Default Shipping Address</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, City, Pincode"
                      className="w-full bg-brand-bg/40 border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                    <MapPin className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-brand-dark hover:bg-brand-primary text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-6 text-center text-xs text-brand-muted pt-4 border-t border-brand-border/60">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-brand-primary font-bold hover:underline ml-1"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-brand-primary font-bold hover:underline ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
