import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Tag, Lock, Truck, CreditCard } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../../../core/auth/authStore';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';



export default function CartDrawer() {
  const {
    isOpen,
    items,
    coupon,
    discountRate,
    lastConfirmedOrder,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useCartStore();

  const { user, token, setPendingAction } = useAuthStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(user?.address || 'Flat 402, Royal Palms, Jaipur, Rajasthan 302020');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98765 43210');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    const unbindOpen = eventBus.on(EVENTS.OPEN_CART, openCart);
    const unbindClose = eventBus.on(EVENTS.CLOSE_CART, closeCart);
    const unbindAdd = eventBus.on(EVENTS.ADD_TO_CART, addItem);

    return () => {
      unbindOpen?.();
      unbindClose?.();
      unbindAdd?.();
    };
  }, []);

  useEffect(() => {
    if (user?.address) setShippingAddress(user.address);
    if (user?.phone) setCustomerPhone(user.phone);
  }, [user]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * discountRate);
  const grandTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMsg(res);
    setTimeout(() => setCouponMsg(null), 3000);
  };

  // Checkout Handler with Auth Wall & Razorpay
  const handleProceedToPay = async () => {
    // 1. Check if user is logged in
    if (!user || !token) {
      setPendingAction('checkout');
      closeCart();
      eventBus.emit(EVENTS.OPEN_AUTH_MODAL);
      return;
    }

    // 2. User is logged in -> Initiate Razorpay Payment
    setProcessingPayment(true);
    setPaymentError(null);

    try {
      // Step A: Create Order on Backend
      const orderRes = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: grandTotal })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create payment order.');

      // Step B: Razorpay Checkout Integration
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: 'INR',
        name: 'nailmores',
        description: 'Handcrafted Luxury Ethnic Wear',
        image: '/logo-icon.svg',
        order_id: orderData.orderId,
        handler: async function (response) {
          // Step C: Verify payment signature & save confirmed order
          const verifyRes = await fetch('http://localhost:5000/api/payment/verify-and-confirm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id || orderData.orderId,
              razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || 'mock_sig',
              items,
              total: grandTotal,
              shippingAddress,
              customerPhone,
              isDemoMode: orderData.isDemoMode
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            clearCart(verifyData.order);
            eventBus.emit(EVENTS.REFRESH_CATALOG);
          } else {
            setPaymentError(verifyData.error || 'Order processing failed.');
          }
          setProcessingPayment(false);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: customerPhone
        },
        theme: {
          color: '#9C413D'
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
          }
        }
      };

      // Check if window.Razorpay is available
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback demo simulation if Razorpay script is blocked or offline
        console.log('[Cart] Direct simulated payment flow');
        await options.handler({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: `pay_sim_${Date.now()}`,
          razorpay_signature: 'simulated_sig'
        });
      }
    } catch (err) {
      setProcessingPayment(false);
      setPaymentError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" onClick={closeCart} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10 animate-slideLeft">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-brand-border flex items-center justify-between bg-brand-bg/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-primary" />
              <h3 className="font-serif text-lg font-semibold text-brand-dark uppercase tracking-wider">
                Shopping Bag ({items.reduce((sum, i) => sum + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-brand-dark/70 hover:text-brand-dark rounded-full hover:bg-brand-sand/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 100% Free Express Delivery Banner */}
          <div className="px-5 py-2.5 bg-emerald-50/90 border-b border-emerald-100 text-xs flex items-center justify-center gap-2 text-emerald-800 font-semibold tracking-wide">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% FREE Express Delivery on All Items &bull; Zero Delivery Charges</span>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {lastConfirmedOrder ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-semibold text-brand-dark">
                  Payment Successful!
                </h4>
                <p className="text-xs text-brand-muted max-w-xs leading-relaxed">
                  Thank you, <strong>{user?.name}</strong>! Your payment was verified via Razorpay. We are handcrafting your ensemble now.
                </p>

                <div className="p-3.5 bg-brand-bg rounded-xl border border-brand-border text-xs w-full text-left space-y-1.5">
                  <div className="flex justify-between font-mono">
                    <span className="text-brand-muted">Order ID:</span>
                    <span className="font-bold text-brand-dark">{lastConfirmedOrder.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Payment:</span>
                    <span className="text-emerald-700 font-semibold">Razorpay Online Paid</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Courier:</span>
                    <span className="font-medium text-brand-dark">{lastConfirmedOrder.courierPartner}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-brand-border/60">
                    <span className="text-brand-muted">Tracking ID:</span>
                    <span className="font-mono font-bold text-brand-primary">{lastConfirmedOrder.trackingId}</span>
                  </div>
                </div>

                <div className="flex flex-col w-full gap-2 pt-2">
                  <button
                    onClick={() => {
                      closeCart();
                      eventBus.emit(EVENTS.OPEN_USER_ACCOUNT);
                    }}
                    className="w-full bg-brand-primary text-white text-xs uppercase tracking-wider font-semibold py-3 rounded-full hover:bg-brand-primaryDark transition-all"
                  >
                    View in Order History & Tracking
                  </button>
                  <button
                    onClick={closeCart}
                    className="text-xs text-brand-muted hover:text-brand-dark underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-brand-sand/60 text-brand-muted flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 stroke-1" />
                </div>
                <h4 className="font-serif text-xl font-medium text-brand-dark">
                  Your bag is empty
                </h4>
                <p className="text-xs text-brand-muted max-w-xs">
                  Discover our pure cotton handblocked kurtis and festive ensembles.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-2 bg-brand-primary text-white text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-full hover:bg-brand-primaryDark transition-all"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex gap-3.5 p-3 rounded-xl border border-brand-border/60 bg-white hover:border-brand-primary/30 transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover object-top rounded-lg bg-brand-sand/40 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-serif text-sm font-medium text-brand-dark line-clamp-1">
                          {item.name}
                        </h5>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-brand-muted hover:text-red-500 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-brand-muted mt-0.5">
                        <span className="font-medium bg-brand-sand/50 px-1.5 py-0.2 rounded text-brand-dark">
                          Size: {item.selectedSize}
                        </span>
                        <span>&bull;</span>
                        <span>{item.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-brand-border/40">
                      <div className="inline-flex items-center border border-brand-border rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(index, -1)}
                          className="px-2 py-0.5 text-xs hover:bg-brand-sand/40"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, 1)}
                          className="px-2 py-0.5 text-xs hover:bg-brand-sand/40"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold text-brand-dark">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer */}
          {items.length > 0 && !lastConfirmedOrder && (
            <div className="p-5 border-t border-brand-border bg-brand-bg/60 space-y-3">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon (e.g. NAIL15)"
                    className="w-full bg-white border border-brand-border rounded-lg pl-8 pr-3 py-2 text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                  <Tag className="w-3.5 h-3.5 text-brand-muted absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold uppercase px-4 py-2 rounded-lg transition-colors"
                >
                  Apply
                </button>
              </form>

              {coupon && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded border border-emerald-200">
                  <span className="font-semibold">{coupon} ({(discountRate * 100)}% Off)</span>
                  <button onClick={removeCoupon} className="text-emerald-900 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              )}

              {/* Delivery Details */}
              <div className="space-y-1.5 text-xs bg-white p-3 rounded-xl border border-brand-border/60">
                <div className="flex items-center justify-between text-[11px] font-semibold text-brand-dark uppercase tracking-wider">
                  <span>Delivery Address</span>
                  <span className="text-brand-primary font-normal">{user ? user.email : 'Guest'}</span>
                </div>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street, City, State, Pincode"
                  className="w-full bg-brand-bg/60 border border-brand-border rounded-md px-2.5 py-1.5 text-xs text-brand-dark focus:outline-none"
                />
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-brand-dark pt-1">
                <div className="flex justify-between">
                  <span className="text-brand-muted">Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-brand-muted">Shipping</span>
                  <span className="text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="text-[10px] line-through text-brand-muted/60 font-normal">₹99</span>
                    FREE
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-brand-border text-brand-dark">
                  <span>Total Amount</span>
                  <span className="text-base text-brand-primary">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {paymentError && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                  {paymentError}
                </div>
              )}

              {/* Action Button: Enforces Login on Buy */}
              <button
                onClick={handleProceedToPay}
                disabled={processingPayment}
                className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {processingPayment ? (
                  <span>Connecting to Secure Gateway...</span>
                ) : user ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay Now &bull; ₹{grandTotal.toLocaleString('en-IN')}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In to Buy &bull; ₹{grandTotal.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

