import React, { useState } from 'react';
import {
  Truck, RefreshCw, Ruler, ShieldCheck, Search, CheckCircle2,
  Package, Clock, ArrowRight, HelpCircle, ChevronDown, ChevronUp,
  MapPin, Phone, MessageSquare, ExternalLink, ArrowLeft, AlertCircle
} from 'lucide-react';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';

export default function PatronCarePage({ initialTab = 'tracking', onBack }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'tracking' | 'exchange' | 'shipping' | 'sizing'
  const [unit, setUnit] = useState('in'); // 'in' | 'cm'

  // Tracking state
  const [trackingQuery, setTrackingQuery] = useState('NM-2026-8841');
  const [trackedOrder, setTrackedOrder] = useState({
    orderId: 'NM-2026-8841',
    awbNumber: 'BD-884920194IN',
    carrier: 'BlueDart Express Air',
    status: 'In Transit',
    currentStage: 3, // 1 to 5
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    destination: 'Bandra West, Mumbai, MH - 400050',
    item: 'Gulzar Floral Handblock Short Kurti (Size M) + Linen Trousers',
    timeline: [
      { time: '13 Nov 2026, 02:30 PM', location: 'Mumbai Air Hub', event: 'Shipment arrived at destination facility and scheduled for local sorting.' },
      { time: '12 Nov 2026, 08:45 PM', location: 'Jaipur Sorting Center', event: 'Departed transit hub via BlueDart Air Cargo.' },
      { time: '12 Nov 2026, 03:15 PM', location: 'nailmores Jaipur Atelier', event: 'Handcrafted inspection passed, packed in luxury cotton tote & handed over to carrier.' },
      { time: '11 Nov 2026, 06:10 PM', location: 'nailmores Studio', event: 'Order confirmed & payment verified via Razorpay.' }
    ]
  });

  // Exchange state
  const [exchangeOrderNumber, setExchangeOrderNumber] = useState('');
  const [exchangePhone, setExchangePhone] = useState('');
  const [exchangeReason, setExchangeReason] = useState('Size too snug around bust');
  const [exchangeCurrentSize, setExchangeCurrentSize] = useState('M');
  const [exchangeNewSize, setExchangeNewSize] = useState('L');
  const [exchangeSubmitted, setExchangeSubmitted] = useState(false);
  const [exchangeTicketId, setExchangeTicketId] = useState('');

  // Sizing chart data (inches)
  const kurtiSizes = [
    { size: 'XS', label: '34', bust: 34, waist: 30, hip: 38, shoulder: 14.0, lengthShort: 29, lengthLong: 46 },
    { size: 'S', label: '36', bust: 36, waist: 32, hip: 40, shoulder: 14.5, lengthShort: 29.5, lengthLong: 46.5 },
    { size: 'M', label: '38', bust: 38, waist: 34, hip: 42, shoulder: 15.0, lengthShort: 30, lengthLong: 47 },
    { size: 'L', label: '40', bust: 40, waist: 36, hip: 44, shoulder: 15.5, lengthShort: 30.5, lengthLong: 47.5 },
    { size: 'XL', label: '42', bust: 42, waist: 38, hip: 46, shoulder: 16.0, lengthShort: 31, lengthLong: 48 },
    { size: 'XXL', label: '44', bust: 44, waist: 40, hip: 48, shoulder: 16.5, lengthShort: 31.5, lengthLong: 48.5 },
    { size: '3XL', label: '46', bust: 46, waist: 42, hip: 50, shoulder: 17.0, lengthShort: 32, lengthLong: 49 }
  ];

  const bottomSizes = [
    { size: 'S', waist: 28, hip: 38, thigh: 23, length: 37, inseam: 26 },
    { size: 'M', waist: 30, hip: 40, thigh: 24, length: 37.5, inseam: 26.5 },
    { size: 'L', waist: 32, hip: 42, thigh: 25, length: 38, inseam: 27 },
    { size: 'XL', waist: 34, hip: 44, thigh: 26, length: 38.5, inseam: 27.5 },
    { size: 'XXL', waist: 36, hip: 46, thigh: 27, length: 39, inseam: 28 }
  ];

  const formatVal = (inches) => {
    if (unit === 'cm') {
      return (inches * 2.54).toFixed(1);
    }
    return inches;
  };

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'Can I exchange my Kurti for a completely different design or color?',
      a: 'Yes, absolutely. Our 7-Day Doorstep Exchange lets you swap for either a different size of the same silhouette or any other kurti/bottom piece in our catalog with price adjustment.'
    },
    {
      q: 'Are there any reverse courier pickup charges for sizing exchange?',
      a: 'Zero. Doorstep reverse pickup is 100% complimentary across India. Our courier partner will collect the piece from your address.'
    },
    {
      q: 'How do I know my exact bust size for nailmores straight kurtis?',
      a: 'We recommend measuring your actual bust circumference with a standard measuring tape. Our tailoring team builds 2 inches of natural breathing room into every straight kurti, so order your exact measured bust size.'
    },
    {
      q: 'What is the standard dispatch time for ready-to-ship pieces?',
      a: 'All in-stock kurtis and ethnic trousers are handcrafted, steam-pressed, and dispatched within 24 to 48 business hours from our Jaipur atelier.'
    }
  ];

  const handleTrackSearch = (e) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;
    setTrackedOrder({
      orderId: trackingQuery.trim().toUpperCase(),
      awbNumber: 'BD-' + Math.floor(100000000 + Math.random() * 900000000) + 'IN',
      carrier: 'BlueDart Express Air',
      status: 'In Transit',
      currentStage: 3,
      estimatedDelivery: 'Within 2 business days',
      destination: 'Verified Patron Address, India',
      item: 'Artisanal Handblock Kurti Ensemble (Pure Cotton)',
      timeline: [
        { time: 'Today, 11:30 AM', location: 'Regional Sorting Hub', event: 'Consignment sorted and dispatched for transit.' },
        { time: 'Yesterday, 04:15 PM', location: 'nailmores Jaipur Atelier', event: 'Quality assurance verified, packed in eco-friendly cotton pouch.' },
        { time: '2 Days Ago', location: 'nailmores Studio', event: 'Order verified & payment confirmed.' }
      ]
    });
  };

  const handleExchangeSubmit = (e) => {
    e.preventDefault();
    if (!exchangeOrderNumber) return;
    const ticket = 'EXCH-' + Math.floor(10000 + Math.random() * 90000);
    setExchangeTicketId(ticket);
    setExchangeSubmitted(true);
  };

  return (
    <div className="bg-brand-bg min-h-screen pb-24">
      
      {/* Top Navigation & Breadcrumbs */}
      <div className="bg-brand-sand/40 border-b border-brand-border/60 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => {
              if (onBack) onBack();
              else eventBus.emit(EVENTS.BACK_TO_HOME);
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-dark hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>

          <div className="text-[11px] text-brand-muted hidden sm:block">
            <span>Home</span> &bull; <span className="font-medium text-brand-dark">Patron Care & Concierge</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white border-b border-brand-border/60 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sand text-brand-primary text-[10px] font-bold uppercase tracking-[0.2em]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Atelier Guarantee & Care</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-5xl font-normal text-brand-dark">
            nailmores Patron Concierge
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-xl mx-auto font-light leading-relaxed">
            From Jaipur loom to your doorstep. Track live courier dispatches, initiate doorstep sizing exchanges, or find your perfect silhouette measurements.
          </p>
        </div>
      </div>

      {/* Floating Category Navigation Tabs */}
      <div className="sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur-md border-b border-brand-border shadow-xs">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 flex items-center justify-start sm:justify-center gap-1.5 sm:gap-4 overflow-x-auto no-scrollbar py-2.5 sm:py-3">
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'tracking'
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-brand-sand/40 hover:bg-brand-sand text-brand-dark'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Live Order Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab('exchange')}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'exchange'
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-brand-sand/40 hover:bg-brand-sand text-brand-dark'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>7-Day Sizing Exchange</span>
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'shipping'
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-brand-sand/40 hover:bg-brand-sand text-brand-dark'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Shipping Information</span>
          </button>

          <button
            onClick={() => setActiveTab('sizing')}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'sizing'
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-brand-sand/40 hover:bg-brand-sand text-brand-dark'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Size Guide & Fit Tips</span>
          </button>
        </div>
      </div>

      {/* Main Tab Panels */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">

        {/* ============================================================== */}
        {/* TAB 1: LIVE ORDER TRACKING (AWB) */}
        {/* ============================================================== */}
        {activeTab === 'tracking' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Search Input Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/80 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                Consignment Lookup
              </span>
              <h2 className="font-serif text-2xl font-normal text-brand-dark mt-1 mb-4">
                Track Your Jaipur Shipment
              </h2>
              <p className="text-xs text-brand-muted mb-6">
                Enter your Order Reference ID (e.g., <code>NM-2026-8841</code>) or your Courier AWB Consignment Number sent via SMS & WhatsApp.
              </p>

              <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={trackingQuery}
                    onChange={(e) => setTrackingQuery(e.target.value)}
                    placeholder="Enter Order ID or BlueDart AWB..."
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-border bg-brand-sand/20 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primaryDark text-white px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 shadow-md"
                >
                  Track Consignment
                </button>
              </form>
            </div>

            {/* Tracking Results Card */}
            {trackedOrder && (
              <div className="bg-white rounded-3xl border border-brand-border/80 shadow-sm overflow-hidden">
                {/* Header Strip */}
                <div className="bg-brand-dark text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">
                      Verified Dispatch
                    </span>
                    <h3 className="font-serif text-2xl font-normal mt-0.5">
                      Order #{trackedOrder.orderId}
                    </h3>
                    <p className="text-xs text-brand-sand/70 mt-1">
                      Carrier: <strong className="text-white">{trackedOrder.carrier}</strong> &bull; AWB: <strong className="text-brand-gold">{trackedOrder.awbNumber}</strong>
                    </p>
                  </div>
                  <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 text-right sm:text-right">
                    <span className="text-[10px] uppercase text-brand-sand/70 block">Estimated Arrival</span>
                    <span className="text-sm font-bold text-white font-serif">{trackedOrder.estimatedDelivery}</span>
                  </div>
                </div>

                {/* Visual Stepper */}
                <div className="p-6 sm:p-8 border-b border-brand-border/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-muted block mb-6">
                    Live Dispatch Progress
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-xs mb-2">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-brand-dark">Confirmed</span>
                      <span className="text-[10px] text-brand-muted">Payment Done</span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-xs mb-2">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-brand-dark">QC Handcrafted</span>
                      <span className="text-[10px] text-brand-muted">Jaipur Atelier</span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-md animate-pulse mb-2">
                        <Truck className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-brand-primary">In Transit</span>
                      <span className="text-[10px] text-brand-muted">Air Freight</span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-brand-sand text-brand-muted flex items-center justify-center font-bold text-sm mb-2">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-brand-muted">Out for Delivery</span>
                      <span className="text-[10px] text-brand-muted">Doorstep Drop</span>
                    </div>
                  </div>
                </div>

                {/* Package & Address Summary */}
                <div className="p-6 sm:p-8 bg-brand-sand/15 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-brand-border/60 text-xs">
                  <div>
                    <span className="font-bold text-brand-muted uppercase text-[10px] block mb-1">Ensemble Details</span>
                    <p className="font-serif text-sm font-medium text-brand-dark">{trackedOrder.item}</p>
                    <span className="text-[11px] text-emerald-700 font-medium inline-block mt-1">
                      🌿 Packed in zero-plastic organic cotton tote bag
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-brand-muted uppercase text-[10px] block mb-1">Delivery Destination</span>
                    <p className="text-brand-dark font-medium">{trackedOrder.destination}</p>
                    <span className="text-[11px] text-brand-muted block mt-1">Contactless delivery verified with OTP</span>
                  </div>
                </div>

                {/* Detailed Checkpoint Timeline */}
                <div className="p-6 sm:p-8">
                  <h4 className="font-serif text-base font-normal text-brand-dark mb-4">
                    Carrier Transit Checkpoints
                  </h4>
                  <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-border">
                    {trackedOrder.timeline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 relative">
                        <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center z-10 ${
                          idx === 0 ? 'bg-brand-primary text-white shadow-xs' : 'bg-brand-sand text-brand-muted'
                        }`}>
                          <div className="w-2 h-2 rounded-full bg-current" />
                        </div>
                        <div className="text-xs flex-1">
                          <div className="flex items-center justify-between text-[11px] text-brand-muted">
                            <span className="font-semibold text-brand-dark">{item.location}</span>
                            <span>{item.time}</span>
                          </div>
                          <p className="text-brand-dark/80 mt-0.5 font-light leading-relaxed">{item.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Assistance Card */}
            <div className="p-6 rounded-2xl bg-white border border-brand-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h5 className="font-serif text-base text-brand-dark font-normal">Need assistance with your courier delivery?</h5>
                <p className="text-xs text-brand-muted mt-0.5">Our Jaipur Atelier logistics team responds in under 15 minutes.</p>
              </div>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Atelier Support</span>
              </a>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: 7-DAY SIZING EXCHANGE */}
        {/* ============================================================== */}
        {activeTab === 'exchange' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Banner */}
            <div className="bg-brand-sand/50 p-6 sm:p-8 rounded-3xl border border-brand-border/80 text-center space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-primary">
                Atelier Confidence
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-brand-dark">
                Complimentary 7-Day Doorstep Sizing Exchange
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted max-w-lg mx-auto font-light leading-relaxed">
                We understand that every body is unique. If your kurti feels a little snug at the bust or loose around the hips, we will arrange a free reverse pickup and deliver your perfect fit.
              </p>
            </div>

            {/* 4 Steps Graphic */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-brand-border/80 text-center">
                <span className="w-7 h-7 rounded-full bg-brand-sand text-brand-primary font-bold text-xs inline-flex items-center justify-center mb-2">1</span>
                <h5 className="font-serif text-xs font-semibold text-brand-dark">Fill 1-Min Form</h5>
                <p className="text-[11px] text-brand-muted mt-1">Select your order and replacement size</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-brand-border/80 text-center">
                <span className="w-7 h-7 rounded-full bg-brand-sand text-brand-primary font-bold text-xs inline-flex items-center justify-center mb-2">2</span>
                <h5 className="font-serif text-xs font-semibold text-brand-dark">Doorstep Pickup</h5>
                <p className="text-[11px] text-brand-muted mt-1">Courier collects from your home for FREE</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-brand-border/80 text-center">
                <span className="w-7 h-7 rounded-full bg-brand-sand text-brand-primary font-bold text-xs inline-flex items-center justify-center mb-2">3</span>
                <h5 className="font-serif text-xs font-semibold text-brand-dark">Atelier QC</h5>
                <p className="text-[11px] text-brand-muted mt-1">Quick check for original tags & unworn condition</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-brand-border/80 text-center">
                <span className="w-7 h-7 rounded-full bg-brand-sand text-brand-primary font-bold text-xs inline-flex items-center justify-center mb-2">4</span>
                <h5 className="font-serif text-xs font-semibold text-brand-dark">Express Dispatch</h5>
                <p className="text-[11px] text-brand-muted mt-1">Your new size is dispatched within 24 hours</p>
              </div>
            </div>

            {/* Interactive Exchange Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/80 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                Self-Service Portal
              </span>
              <h3 className="font-serif text-2xl font-normal text-brand-dark mt-1 mb-6">
                Request Sizing Exchange
              </h3>

              {exchangeSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-serif text-lg font-medium text-emerald-900">
                    Exchange Request Registered Successfully!
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Your exchange reference ticket is <strong>{exchangeTicketId}</strong>. A BlueDart doorstep pickup has been scheduled for tomorrow. We have sent the confirmation to your mobile number.
                  </p>
                  <button
                    onClick={() => setExchangeSubmitted(false)}
                    className="inline-block mt-2 px-6 py-2 rounded-full bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleExchangeSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-brand-muted mb-1">
                        Order Reference ID *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. NM-2026-8841"
                        required
                        value={exchangeOrderNumber}
                        onChange={(e) => setExchangeOrderNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-sand/20 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-brand-muted mb-1">
                        Phone Number or Email *
                      </label>
                      <input
                        type="text"
                        placeholder="+91 98765 XXXXX"
                        required
                        value={exchangePhone}
                        onChange={(e) => setExchangePhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-sand/20 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-brand-muted mb-1">
                        Current Size Delivered
                      </label>
                      <select
                        value={exchangeCurrentSize}
                        onChange={(e) => setExchangeCurrentSize(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-sand/20 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                      >
                        <option value="XS">XS (Bust 34)</option>
                        <option value="S">S (Bust 36)</option>
                        <option value="M">M (Bust 38)</option>
                        <option value="L">L (Bust 40)</option>
                        <option value="XL">XL (Bust 42)</option>
                        <option value="XXL">XXL (Bust 44)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-brand-primary mb-1">
                        Desired Replacement Size *
                      </label>
                      <select
                        value={exchangeNewSize}
                        onChange={(e) => setExchangeNewSize(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-brand-primary bg-brand-sand/20 text-xs font-semibold focus:ring-1 focus:ring-brand-primary focus:outline-none"
                      >
                        <option value="XS">XS (Bust 34)</option>
                        <option value="S">S (Bust 36)</option>
                        <option value="M">M (Bust 38)</option>
                        <option value="L">L (Bust 40)</option>
                        <option value="XL">XL (Bust 42)</option>
                        <option value="XXL">XXL (Bust 44)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-brand-muted mb-1">
                      Exchange Reason
                    </label>
                    <select
                      value={exchangeReason}
                      onChange={(e) => setExchangeReason(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-sand/20 text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                    >
                      <option value="Size too snug around bust">Size too snug around bust</option>
                      <option value="Prefer relaxed ease / one size larger">Prefer relaxed ease / one size larger</option>
                      <option value="Waist / hip fit adjustment">Waist / hip fit adjustment</option>
                      <option value="Exchange for alternate silhouette/color">Exchange for alternate silhouette/color</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white py-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
                    >
                      Submit Doorstep Exchange Request &bull; 100% Free Pickup
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Exchange FAQs */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/80">
              <h4 className="font-serif text-lg font-normal text-brand-dark mb-4">
                Frequently Asked Exchange Questions
              </h4>
              <div className="divide-y divide-brand-border/60">
                {faqs.map((faq, i) => (
                  <div key={i} className="py-3">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between text-left text-xs font-semibold text-brand-dark"
                    >
                      <span>{faq.q}</span>
                      {openFaq === i ? <ChevronUp className="w-4 h-4 text-brand-primary" /> : <ChevronDown className="w-4 h-4 text-brand-muted" />}
                    </button>
                    {openFaq === i && (
                      <p className="text-xs text-brand-muted mt-2 font-light leading-relaxed">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: SHIPPING INFORMATION */}
        {/* ============================================================== */}
        {activeTab === 'shipping' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-brand-border/80 text-center space-y-2">
                <Truck className="w-6 h-6 text-brand-primary mx-auto" />
                <h5 className="font-serif text-sm font-semibold text-brand-dark">FREE Shipping</h5>
                <p className="text-xs text-brand-muted">Complimentary 100% FREE express shipping on all orders across India.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-brand-border/80 text-center space-y-2">
                <Clock className="w-6 h-6 text-brand-primary mx-auto" />
                <h5 className="font-serif text-sm font-semibold text-brand-dark">24–48 Hr Dispatch</h5>
                <p className="text-xs text-brand-muted">Hand-inspected & dispatched promptly from Jaipur atelier.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-brand-border/80 text-center space-y-2">
                <ShieldCheck className="w-6 h-6 text-brand-primary mx-auto" />
                <h5 className="font-serif text-sm font-semibold text-brand-dark">100% Insured Transit</h5>
                <p className="text-xs text-brand-muted">BlueDart & Delhivery Priority Air courier partners.</p>
              </div>
            </div>

            {/* Delivery Timeline Table */}
            <div className="bg-white rounded-3xl border border-brand-border/80 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-brand-border/60">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-primary">
                  Pan-India Coverage
                </span>
                <h3 className="font-serif text-2xl font-normal text-brand-dark mt-1">
                  Estimated Delivery Timelines
                </h3>
                <p className="text-xs text-brand-muted mt-1">
                  We service over 27,000+ PIN codes. All deliveries are tracked live with direct SMS updates.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-sand/40 border-b border-brand-border/60 text-brand-muted uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6 font-semibold">Region / Geography</th>
                      <th className="py-3.5 px-6 font-semibold">Estimated Transit Time</th>
                      <th className="py-3.5 px-6 font-semibold">Primary Courier Partner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60 text-brand-dark">
                    <tr>
                      <td className="py-3.5 px-6 font-medium">Metro Hubs (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune)</td>
                      <td className="py-3.5 px-6 font-bold text-brand-primary">2 – 3 Business Days</td>
                      <td className="py-3.5 px-6 text-brand-muted">BlueDart Express Air</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 font-medium">Rajasthan & North India</td>
                      <td className="py-3.5 px-6 font-bold text-brand-primary">1 – 2 Business Days</td>
                      <td className="py-3.5 px-6 text-brand-muted">BlueDart / Delhivery Priority</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 font-medium">Tier 2 & Tier 3 Cities (Across All States)</td>
                      <td className="py-3.5 px-6 font-bold text-brand-primary">3 – 5 Business Days</td>
                      <td className="py-3.5 px-6 text-brand-muted">Delhivery / DTDC Express</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 font-medium">North East, J&K, Island Territories</td>
                      <td className="py-3.5 px-6 font-bold text-brand-primary">5 – 7 Business Days</td>
                      <td className="py-3.5 px-6 text-brand-muted">India Post Speed Post / BlueDart</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Eco Packaging Story */}
            <div className="bg-brand-sand/40 p-6 sm:p-8 rounded-3xl border border-brand-border/80 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white border border-brand-border flex items-center justify-center shrink-0 shadow-xs">
                <Package className="w-8 h-8 text-brand-primary" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-serif text-lg font-medium text-brand-dark">
                  Zero-Plastic Biodegradable Packaging
                </h4>
                <p className="text-xs text-brand-muted font-light leading-relaxed">
                  Every nailmores garment is wrapped in recycled tissue, slipped into a reusable unbleached cotton tote bag, and secured inside a water-resistant tamper-evident kraft courier box. Designed to protect both your garments and the planet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: SIZE GUIDE & FIT TIPS */}
        {/* ============================================================== */}
        {activeTab === 'sizing' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Size Chart Unit Switcher */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                    Measurement Charts
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-brand-dark mt-1">
                    Women's Ethnic Kurti Size Guide
                  </h3>
                  <p className="text-xs text-brand-muted mt-1">
                    Garment measurements for our Jaipur handblock short kurtis, flared anarkalis, and ethnic bottoms.
                  </p>
                </div>

                {/* Unit Switcher */}
                <div className="inline-flex items-center gap-1 p-1 rounded-full bg-brand-sand border border-brand-border/80 self-start sm:self-center">
                  <button
                    onClick={() => setUnit('in')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      unit === 'in' ? 'bg-brand-primary text-white shadow-xs' : 'text-brand-dark hover:text-brand-primary'
                    }`}
                  >
                    Inches (in)
                  </button>
                  <button
                    onClick={() => setUnit('cm')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      unit === 'cm' ? 'bg-brand-primary text-white shadow-xs' : 'text-brand-dark hover:text-brand-primary'
                    }`}
                  >
                    Centimeters (cm)
                  </button>
                </div>
              </div>

              {/* Kurti Sizing Table */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-sand/50 border-b border-brand-border/60 text-brand-muted uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4 font-bold">Standard Size</th>
                      <th className="py-3 px-4 font-bold">Tag #</th>
                      <th className="py-3 px-4 font-bold">Bust ({unit})</th>
                      <th className="py-3 px-4 font-bold">Waist ({unit})</th>
                      <th className="py-3 px-4 font-bold">Hip ({unit})</th>
                      <th className="py-3 px-4 font-bold">Shoulder ({unit})</th>
                      <th className="py-3 px-4 font-bold">Short Kurti Length</th>
                      <th className="py-3 px-4 font-bold">Anarkali Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60 text-brand-dark">
                    {kurtiSizes.map((row) => (
                      <tr key={row.size} className="hover:bg-brand-sand/20 transition-colors">
                        <td className="py-3 px-4 font-bold text-brand-primary">{row.size}</td>
                        <td className="py-3 px-4 text-brand-muted">{row.label}</td>
                        <td className="py-3 px-4 font-semibold">{formatVal(row.bust)}</td>
                        <td className="py-3 px-4">{formatVal(row.waist)}</td>
                        <td className="py-3 px-4">{formatVal(row.hip)}</td>
                        <td className="py-3 px-4">{formatVal(row.shoulder)}</td>
                        <td className="py-3 px-4">{formatVal(row.lengthShort)}</td>
                        <td className="py-3 px-4">{formatVal(row.lengthLong)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Wear Sizing Table */}
              <h4 className="font-serif text-base font-normal text-brand-dark mb-3">
                Ethnic Trousers & Palazzo Pants Chart
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-sand/50 border-b border-brand-border/60 text-brand-muted uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4 font-bold">Size</th>
                      <th className="py-3 px-4 font-bold">Natural Waist ({unit})</th>
                      <th className="py-3 px-4 font-bold">Hip ({unit})</th>
                      <th className="py-3 px-4 font-bold">Thigh Circumference ({unit})</th>
                      <th className="py-3 px-4 font-bold">Outer Length ({unit})</th>
                      <th className="py-3 px-4 font-bold">Inseam ({unit})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60 text-brand-dark">
                    {bottomSizes.map((row) => (
                      <tr key={row.size} className="hover:bg-brand-sand/20 transition-colors">
                        <td className="py-3 px-4 font-bold text-brand-primary">{row.size}</td>
                        <td className="py-3 px-4 font-semibold">{formatVal(row.waist)}</td>
                        <td className="py-3 px-4">{formatVal(row.hip)}</td>
                        <td className="py-3 px-4">{formatVal(row.thigh)}</td>
                        <td className="py-3 px-4">{formatVal(row.length)}</td>
                        <td className="py-3 px-4">{formatVal(row.inseam)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Illustrated How To Measure Guide */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/80">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-primary">
                Precision Fit
              </span>
              <h4 className="font-serif text-2xl font-normal text-brand-dark mt-1 mb-6">
                How to Measure for nailmores Silhouettes
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-brand-sand/30 border border-brand-border/60 space-y-1">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">1. Bust</span>
                  <p className="text-xs text-brand-muted font-light leading-relaxed">
                    Wrap tape around the fullest part of your bust while keeping tape parallel to the floor. Order this exact size; we add 2 inches of ease.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-brand-sand/30 border border-brand-border/60 space-y-1">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">2. Waist</span>
                  <p className="text-xs text-brand-muted font-light leading-relaxed">
                    Measure around your natural waistline, usually 1 to 2 inches above your navel. Keep tape comfortably loose.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-brand-sand/30 border border-brand-border/60 space-y-1">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">3. Hips & Thighs</span>
                  <p className="text-xs text-brand-muted font-light leading-relaxed">
                    Stand with heels together and measure around the fullest curve of your hips and upper thighs.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-brand-sand/30 border border-brand-border/60 space-y-1">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">4. Silhouette Ease</span>
                  <p className="text-xs text-brand-muted font-light leading-relaxed">
                    Our 100% mulmul cotton kurtis are pre-shrunk and feature an artisanal straight or A-line drop that never feels restrictive.
                  </p>
                </div>
              </div>
            </div>

            {/* Stylist Concierge Assistance */}
            <div className="bg-brand-dark text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">Personal Atelier Fit</span>
                <h4 className="font-serif text-xl font-normal mt-0.5">Still in doubt about which size to pick?</h4>
                <p className="text-xs text-brand-sand/70 mt-1">Chat directly with our Jaipur master tailor on WhatsApp for a personalized recommendation.</p>
              </div>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-brand-gold hover:bg-white text-brand-dark px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Sizing Stylist</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

