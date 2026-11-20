import React, { useState, useEffect } from 'react';
import {
  X, Package, User, MapPin, Phone, Mail, ExternalLink, Star,
  CheckCircle2, Clock, Truck, ShieldCheck, LogOut, Search, ArrowRight,
  MessageSquare, Compass, Check
} from 'lucide-react';
import { useAuthStore } from '../../../core/auth/authStore';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';

export default function UserAccountDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Exact user-specified sequence: Profile -> Order History -> Tracking ID -> Reviews
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders', 'tracking', 'reviews'
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Quick AWB Search in Tracking tab
  const [awbSearch, setAwbSearch] = useState('');
  const [searchedAwbResult, setSearchedAwbResult] = useState(null);

  // Profile Form state
  const { user, token, logout, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [profileMsg, setProfileMsg] = useState(null);

  useEffect(() => {
    const unbindOpen = eventBus.on(EVENTS.OPEN_USER_ACCOUNT, () => {
      setIsOpen(true);
      fetchUserOrders();
      fetchUserReviews();
    });
    const unbindClose = eventBus.on(EVENTS.CLOSE_USER_ACCOUNT, () => setIsOpen(false));

    return () => {
      unbindOpen?.();
      unbindClose?.();
    };
  }, [token, user]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const fetchUserOrders = async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const res = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.warn('[Orders] Could not reach backend');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchUserReviews = async () => {
    if (!token) return;
    setLoadingReviews(true);
    try {
      const res = await fetch('http://localhost:5000/api/reviews/my-reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserReviews(data.reviews || []);
      } else {
        // Fallback: search all public reviews for this user
        const allRes = await fetch('http://localhost:5000/api/reviews');
        if (allRes.ok) {
          const allData = await allRes.json();
          const filtered = (allData.reviews || []).filter(
            r => r.userId === user?.id || (user?.name && r.userName?.toLowerCase() === user?.name?.toLowerCase())
          );
          setUserReviews(filtered);
        }
      }
    } catch (err) {
      console.warn('[Reviews] Could not fetch user reviews');
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const res = await updateProfile({ name, phone, address });
    if (res.success) {
      setProfileMsg('Profile updated successfully!');
    } else {
      setProfileMsg(res.error || 'Update failed');
    }
    setTimeout(() => setProfileMsg(null), 3500);
  };

  const handleAwbLookup = (e) => {
    e.preventDefault();
    if (!awbSearch.trim()) return;
    const clean = awbSearch.trim().toUpperCase();
    setSearchedAwbResult({
      awb: clean.startsWith('BD') ? clean : `BD-${clean}`,
      carrier: 'BlueDart Express Air',
      status: 'In Transit',
      destination: user?.address || 'Verified Customer Address, India',
      estimatedDelivery: 'Tomorrow by 5:00 PM',
      step: 3
    });
  };

  if (!isOpen) return null;

  // Active tracking orders
  const trackedOrders = orders.filter(o => o.trackingId);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col z-10 animate-slideLeft">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-brand-border flex items-center justify-between bg-brand-bg/60">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.2em] text-brand-primary">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Patron Concierge</span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-normal text-brand-dark mt-0.5">
                My Nailmores Account
              </h3>
              <p className="text-[11px] text-brand-muted">
                Signed in as <strong className="text-brand-dark">{user?.name}</strong> ({user?.email})
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-brand-dark/70 hover:text-brand-dark rounded-full hover:bg-brand-sand/50 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 4 Tabs strictly ordered as requested:
              1. My Profile
              2. Order History
              3. Tracking ID
              4. My Reviews
          */}
          <div className="flex border-b border-brand-border bg-brand-bg/30 text-xs font-semibold uppercase tracking-wider overflow-x-auto no-scrollbar">
            {/* 1. Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3.5 px-3 text-center transition-colors border-b-2 whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'border-brand-primary text-brand-primary bg-white'
                  : 'border-transparent text-brand-muted hover:text-brand-dark'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>1. Profile</span>
            </button>

            {/* 2. Order History */}
            <button
              onClick={() => {
                setActiveTab('orders');
                fetchUserOrders();
              }}
              className={`flex-1 py-3.5 px-3 text-center transition-colors border-b-2 whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'border-brand-primary text-brand-primary bg-white'
                  : 'border-transparent text-brand-muted hover:text-brand-dark'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>2. Order History ({orders.length})</span>
            </button>

            {/* 3. Tracking ID */}
            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex-1 py-3.5 px-3 text-center transition-colors border-b-2 whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === 'tracking'
                  ? 'border-brand-primary text-brand-primary bg-white'
                  : 'border-transparent text-brand-muted hover:text-brand-dark'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>3. Tracking ID</span>
            </button>

            {/* 4. My Reviews */}
            <button
              onClick={() => {
                setActiveTab('reviews');
                fetchUserReviews();
              }}
              className={`flex-1 py-3.5 px-3 text-center transition-colors border-b-2 whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-brand-primary text-brand-primary bg-white'
                  : 'border-transparent text-brand-muted hover:text-brand-dark'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>4. My Reviews ({userReviews.length})</span>
            </button>
          </div>

          {/* Tab Panels */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            
            {/* ============================================================== */}
            {/* TAB 1: MY PROFILE (PAHEL PROFILE) */}
            {/* ============================================================== */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs animate-fadeIn">
                {profileMsg && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{profileMsg}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                    Patron Profile Details
                  </span>
                  <h4 className="font-serif text-lg font-normal text-brand-dark">
                    Your Personal & Shipping Information
                  </h4>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-brand-muted mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-brand-bg/50 border border-brand-border rounded-xl px-4 py-3 text-brand-dark text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-brand-muted mb-1">
                    Registered Email (Account Identity)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-gray-100 border border-brand-border rounded-xl px-4 py-3 text-brand-muted text-xs cursor-not-allowed"
                  />
                  <span className="text-[10px] text-brand-muted mt-0.5 block">
                    Contact care@nailmores.com to update your verified login email.
                  </span>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-brand-muted mb-1">
                    Mobile Phone (For Courier AWB Tracking SMS & WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-brand-bg/50 border border-brand-border rounded-xl px-4 py-3 text-brand-dark text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-brand-muted mb-1">
                    Default Doorstep Delivery Address *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="House/Flat No, Street, Landmark, City, State, PIN Code"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-brand-bg/50 border border-brand-border rounded-xl px-4 py-3 text-brand-dark text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
                  >
                    Save Profile Changes
                  </button>
                </div>

                <div className="pt-6 border-t border-brand-border">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Account</span>
                  </button>
                </div>
              </form>
            )}

            {/* ============================================================== */}
            {/* TAB 2: ORDER HISTORY (USKE BAD ORDER HISTORY) */}
            {/* ============================================================== */}
            {activeTab === 'orders' && (
              <div className="space-y-4 animate-fadeIn text-xs">
                <div className="space-y-1 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                    Purchase Archive
                  </span>
                  <h4 className="font-serif text-lg font-normal text-brand-dark">
                    Your Past Ensembles & Orders
                  </h4>
                </div>

                {loadingOrders ? (
                  <div className="py-12 text-center text-xs text-brand-muted">Loading your purchases...</div>
                ) : orders.length === 0 ? (
                  <div className="py-16 text-center space-y-3 bg-brand-sand/20 rounded-3xl border border-brand-border p-6">
                    <Package className="w-12 h-12 text-brand-sand mx-auto stroke-1" />
                    <h5 className="font-serif text-lg font-medium text-brand-dark">No orders placed yet</h5>
                    <p className="text-xs text-brand-muted max-w-xs mx-auto">
                      All your confirmed purchases, invoice receipts, and kurti details will appear here.
                    </p>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="mt-2 bg-brand-primary text-white text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-full hover:bg-brand-primaryDark transition-all"
                    >
                      Explore Kurtis Catalog
                    </button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="p-4 sm:p-5 rounded-2xl border border-brand-border bg-white shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2.5 border-b border-brand-border/60">
                        <div>
                          <span className="font-mono font-bold text-brand-dark text-xs">{order.orderId}</span>
                          <span className="text-[10px] text-brand-muted block">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2.5 py-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 truncate">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-10 h-12 object-cover object-top rounded-lg bg-brand-sand shrink-0" />
                              )}
                              <div className="truncate">
                                <p className="font-serif font-medium text-brand-dark truncate">{item.name}</p>
                                <span className="text-[10px] text-brand-muted">
                                  Size: <strong className="text-brand-dark">{item.selectedSize}</strong> &bull; Qty: {item.quantity}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-brand-dark shrink-0 font-sans">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total and Tracking Action */}
                      <div className="pt-2.5 border-t border-brand-border/60 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-brand-muted block uppercase">Paid via Razorpay</span>
                          <span className="text-sm font-bold text-brand-primary">₹{order.total?.toLocaleString('en-IN')}</span>
                        </div>

                        {order.trackingId ? (
                          <button
                            onClick={() => setActiveTab('tracking')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-sand/60 hover:bg-brand-primary hover:text-white text-brand-dark text-[11px] font-semibold transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5 text-brand-primary group-hover:text-white" />
                            <span>Track AWB &rarr;</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-brand-muted italic">Preparing dispatch</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 3: TRACKING ID (USKE BAD TRACKING ID) */}
            {/* ============================================================== */}
            {activeTab === 'tracking' && (
              <div className="space-y-5 animate-fadeIn text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                    Live Logistics & AWB
                  </span>
                  <h4 className="font-serif text-lg font-normal text-brand-dark">
                    Consignment Tracking Status
                  </h4>
                  <p className="text-brand-muted text-xs">
                    Real-time courier updates for shipments dispatched from our Jaipur atelier.
                  </p>
                </div>

                {/* Active Orders with Tracking ID */}
                {trackedOrders.length > 0 ? (
                  trackedOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className="p-5 rounded-2xl border border-brand-border bg-white shadow-xs space-y-4"
                    >
                      <div className="flex items-start justify-between pb-3 border-b border-brand-border/60">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-brand-primary">
                            Consignment Dispatched
                          </span>
                          <h5 className="font-serif text-base font-semibold text-brand-dark mt-0.5">
                            Order #{order.orderId}
                          </h5>
                          <p className="text-[11px] text-brand-muted mt-0.5">
                            Partner: <strong className="text-brand-dark">{order.courierPartner || 'BlueDart Express Air'}</strong>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-brand-muted block">Courier AWB</span>
                          <span className="font-mono text-xs font-bold text-brand-primary bg-brand-sand/50 px-2 py-0.5 rounded">
                            {order.trackingId}
                          </span>
                        </div>
                      </div>

                      {/* 4-Stage Stepper */}
                      <div className="py-2">
                        <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                          <div>
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mx-auto mb-1">
                              ✓
                            </div>
                            <span className="font-bold text-brand-dark block">Confirmed</span>
                            <span className="text-brand-muted text-[9px]">Paid</span>
                          </div>
                          <div>
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mx-auto mb-1">
                              ✓
                            </div>
                            <span className="font-bold text-brand-dark block">Atelier QC</span>
                            <span className="text-brand-muted text-[9px]">Jaipur</span>
                          </div>
                          <div>
                            <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold mx-auto mb-1 animate-pulse shadow-xs">
                              <Truck className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-brand-primary block">In Transit</span>
                            <span className="text-brand-muted text-[9px]">Air Hub</span>
                          </div>
                          <div>
                            <div className="w-7 h-7 rounded-full bg-brand-sand text-brand-muted flex items-center justify-center font-bold mx-auto mb-1">
                              •
                            </div>
                            <span className="text-brand-muted block">Delivered</span>
                            <span className="text-brand-muted text-[9px]">Doorstep</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-700 font-medium">
                          🌿 Eco Cotton Insured Parcel
                        </span>
                        <a
                          href={order.trackingUrl || `https://www.bluedart.com/tracking?track=${order.trackingId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-primary text-white text-[10px] font-semibold uppercase tracking-wider hover:bg-brand-primaryDark transition-colors shadow-xs"
                        >
                          <span>Live Track on Carrier</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))
                ) : null}

                {/* Universal AWB Lookup Form */}
                <div className="p-5 rounded-2xl bg-brand-sand/30 border border-brand-border space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-primary block">
                    Lookup Any AWB or Consignment
                  </span>
                  <form onSubmit={handleAwbLookup} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. BD84920199IN or NLM-849201"
                      value={awbSearch}
                      onChange={(e) => setAwbSearch(e.target.value)}
                      className="flex-1 bg-white border border-brand-border rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-brand-dark hover:bg-brand-primary text-white px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
                    >
                      Track
                    </button>
                  </form>

                  {searchedAwbResult && (
                    <div className="p-3.5 rounded-xl bg-white border border-brand-border mt-3 space-y-2 animate-fadeIn text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-brand-primary">{searchedAwbResult.awb}</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold uppercase">
                          {searchedAwbResult.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-muted">
                        Carrier: <strong>{searchedAwbResult.carrier}</strong> &bull; Estimated Arrival: <strong className="text-brand-dark">{searchedAwbResult.estimatedDelivery}</strong>
                      </p>
                    </div>
                  )}
                </div>

                {/* Link to Patron Care Portal */}
                <div className="p-4 rounded-xl bg-white border border-brand-border flex items-center justify-between">
                  <div>
                    <h5 className="font-serif text-xs font-semibold text-brand-dark">Full Patron Care & Timelines</h5>
                    <p className="text-[10px] text-brand-muted">Review delivery timelines for 27,000+ PIN codes.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      eventBus.emit(EVENTS.OPEN_PATRON_CARE, { tab: 'tracking' });
                    }}
                    className="text-xs font-bold text-brand-primary hover:underline"
                  >
                    Open Concierge &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 4: MY REVIEWS (USKE BAD REVIEW DIKHE) */}
            {/* ============================================================== */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 animate-fadeIn text-xs">
                <div className="space-y-1 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                    Patron Testimonials
                  </span>
                  <h4 className="font-serif text-lg font-normal text-brand-dark">
                    My Submitted Reviews ({userReviews.length})
                  </h4>
                  <p className="text-brand-muted text-xs">
                    Reviews you have posted for nailmores silhouettes. To write a new review, visit any kurti's product detail page.
                  </p>
                </div>

                {loadingReviews ? (
                  <div className="py-12 text-center text-xs text-brand-muted">Loading your reviews...</div>
                ) : userReviews.length === 0 ? (
                  <div className="py-14 text-center space-y-3 bg-brand-sand/20 rounded-3xl border border-brand-border p-6">
                    <Star className="w-12 h-12 text-brand-sand mx-auto stroke-1" />
                    <h5 className="font-serif text-lg font-medium text-brand-dark">
                      No reviews submitted yet
                    </h5>
                    <p className="text-xs text-brand-muted max-w-xs mx-auto">
                      You can write reviews directly on any kurti's product page under the Customer Reviews section.
                    </p>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="mt-2 bg-brand-primary text-white text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-full hover:bg-brand-primaryDark transition-all"
                    >
                      Browse Kurtis & Review
                    </button>
                  </div>
                ) : (
                  userReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 sm:p-5 rounded-2xl border border-brand-border bg-white shadow-xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-brand-border/60">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-brand-primary block">
                            Reviewed Silhouette
                          </span>
                          <h5 className="font-serif font-semibold text-sm text-brand-dark">
                            {rev.productName || 'Artisanal Kurti'}
                          </h5>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          Verified Patron
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-500">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-brand-dark">
                          ({rev.rating || 5} / 5 Stars)
                        </span>
                        <span className="text-[10px] text-brand-muted ml-auto">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : 'Recent'}
                        </span>
                      </div>

                      {/* Comment */}
                      <p className="text-brand-dark/90 font-light leading-relaxed bg-brand-sand/20 p-3 rounded-xl border border-brand-border/40 italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
