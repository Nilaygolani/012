import React, { useState, useEffect } from 'react';
import {
  X, LayoutDashboard, ShoppingBag, Package, Star, Users, Plus, Edit2, Trash2,
  Truck, CheckCircle, AlertTriangle, ShieldCheck, RefreshCw, ExternalLink, Key, Video, Play
} from 'lucide-react';
import { useAuthStore } from '../../../core/auth/authStore';
import { eventBus, EVENTS } from '../../../core/eventBus/bus';
import Logo from '../../../core/branding/Logo';
import { API_BASE_URL } from '../../../config/api';

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, token } = useAuthStore();

  // Dashboard Data
  const [metrics, setMetrics] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0 });
  const [statusCounts, setStatusCounts] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);

  // Products CRUD Data
  const CATEGORY_SIZE_PRESETS = {
    'Short Kurtis': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Long Kurtis': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Kurti Sets': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Long Kurtas': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Kurta Sets': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Ethnic Bottoms': ['28', '30', '32', '34', '36', 'Free Size'],
    'Co-ord Sets': ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  };

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Short Kurtis',
    price: '',
    originalPrice: '',
    stock: 50,
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    outOfStockSizes: [],
    fabric: '100% Pure Jaipur Mulmul Cotton',
    craft: 'Handblock Wooden Print',
    stylingTips: 'Pair with relaxed white linen trousers or slim-fit denim and minimal silver jhumkis.',
    washCare: 'Gentle hand wash in cold water with mild detergent.',
    images: [
      'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ],
    image: '',
    badge: 'New Arrival'
  });

  // Orders Management Data
  const [orders, setOrders] = useState([]);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [courierPartner, setCourierPartner] = useState('BlueDart Express');
  const [trackingId, setTrackingId] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  // Reviews Moderation Data
  const [reviews, setReviews] = useState([]);

  // Customers Data
  const [customers, setCustomers] = useState([]);

  // Video Reels Data
  const [reels, setReels] = useState([]);
  const [isAddReelOpen, setIsAddReelOpen] = useState(false);
  const [reelForm, setReelForm] = useState({
    title: '',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-around-in-a-long-dress-39727-large.mp4',
    coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    productId: '',
    tags: '#NailmoresCouture, #MulmulTwirl'
  });

  useEffect(() => {
    const unbind = eventBus.on(EVENTS.OPEN_ADMIN_PANEL, () => {
      // Only open if logged in user is actually an administrator
      if (user && user.role === 'admin') {
        setIsOpen(true);
        fetchAllAdminData();
      }
    });

    const unbindClose = eventBus.on(EVENTS.CLOSE_ADMIN_PANEL, () => {
      setIsOpen(false);
    });

    return () => {
      unbind?.();
      unbindClose?.();
    };
  }, [user, token]);

  const fetchAllAdminData = async () => {
    if (!token || user?.role !== 'admin') return;
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const dRes = await fetch(`${API_BASE_URL}/api/analytics/dashboard`, { headers });
      if (dRes.ok) {
        const d = await dRes.json();
        setMetrics(d.metrics);
        setStatusCounts(d.statusCounts);
        setRecentOrders(d.recentOrders);
      }

      const pRes = await fetch(`${API_BASE_URL}/api/products`);
      if (pRes.ok) {
        const p = await pRes.json();
        setProducts(p.products || []);
      }

      const oRes = await fetch(`${API_BASE_URL}/api/orders`, { headers });
      if (oRes.ok) {
        const o = await oRes.json();
        setOrders(o.orders || []);
      }

      const rRes = await fetch(`${API_BASE_URL}/api/reviews/admin/all`, { headers });
      if (rRes.ok) {
        const r = await rRes.json();
        setReviews(r.reviews || []);
      }

      const cRes = await fetch(`${API_BASE_URL}/api/auth/users`, { headers });
      if (cRes.ok) {
        const c = await cRes.json();
        setCustomers(c.users || []);
      }

      const reelRes = await fetch(`${API_BASE_URL}/api/reels`);
      if (reelRes.ok) {
        const rd = await reelRes.json();
        setReels(rd.reels || []);
      }
    } catch (err) {
      console.warn('[Admin] Data fetch warning:', err);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const cleanImages = (productForm.images || []).map(u => String(u || '').trim()).filter(Boolean);
    const primaryImg = cleanImages[0] || productForm.image || 'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80';
    const secondaryImg = cleanImages[1] || cleanImages[0] || primaryImg;

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : Number(productForm.price),
      stock: Number(productForm.stock || 0),
      inStock: Boolean(productForm.inStock),
      sizes: productForm.sizes && productForm.sizes.length > 0 ? productForm.sizes : ['S', 'M', 'L', 'XL'],
      outOfStockSizes: Array.isArray(productForm.outOfStockSizes) ? productForm.outOfStockSizes : [],
      images: cleanImages.length > 0 ? cleanImages : [primaryImg, secondaryImg],
      image: primaryImg,
      hoverImage: secondaryImg
    };

    if (editingProduct) {
      await fetch(`${API_BASE_URL}/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });
    } else {
      await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
    }

    setIsAddProductOpen(false);
    setEditingProduct(null);
    fetchAllAdminData();
    eventBus.emit(EVENTS.REFRESH_CATALOG);
  };

  const handleSaveReel = async (e) => {
    e.preventDefault();
    if (!reelForm.title || !reelForm.videoUrl) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/reels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reelForm)
      });
      if (res.ok) {
        setIsAddReelOpen(false);
        setReelForm({
          title: '',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-around-in-a-long-dress-39727-large.mp4',
          coverImage: 'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80',
          productId: '',
          tags: '#NailmoresCouture, #MulmulTwirl'
        });
        fetchAllAdminData();
        eventBus.emit(EVENTS.REFRESH_REELS);
      }
    } catch (err) {
      console.warn('[Admin] Add reel error:', err);
    }
  };

  const handleDeleteReel = async (reelId) => {
    if (!window.confirm('Are you sure you want to delete this video drop?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/reels/${reelId}`, { method: 'DELETE' });
      fetchAllAdminData();
      eventBus.emit(EVENTS.REFRESH_REELS);
    } catch (err) {
      console.warn('[Admin] Delete reel error:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchAllAdminData();
    eventBus.emit(EVENTS.REFRESH_CATALOG);
  };

  const handleSaveTracking = async (orderId) => {
    if (!trackingId) return;
    await fetch(`${API_BASE_URL}/api/orders/${orderId}/tracking`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        courierPartner,
        trackingId,
        trackingUrl,
        status: 'Shipped'
      })
    });

    setSelectedOrderForTracking(null);
    setTrackingId('');
    fetchAllAdminData();
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    fetchAllAdminData();
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this customer review?')) return;
    await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchAllAdminData();
    eventBus.emit('reviews:refresh');
  };

  // If not open or not admin, render nothing
  if (!isOpen || !user || user.role !== 'admin') return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex bg-brand-dark/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full h-full bg-white flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-brand-dark text-white p-3 sm:p-5 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-white/10">
          <div>
            <div className="flex items-center justify-between pb-3 md:pb-4 mb-2 md:mb-6 border-b border-white/10">
              <div>
                <span className="font-serif tracking-widest text-base sm:text-lg uppercase font-bold text-brand-gold">
                  nailmores
                </span>
                <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider text-brand-sand/60">
                  Administrator Console
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} className="md:hidden text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex md:flex-col overflow-x-auto gap-1 pb-1 md:pb-0 no-scrollbar space-y-0 md:space-y-1.5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`whitespace-nowrap px-3 py-2 md:px-3.5 md:py-2.5 rounded-lg transition-colors flex items-center gap-2 shrink-0 md:w-full ${
                  activeTab === 'dashboard' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-sand/80 hover:bg-white/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview & Sales</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`whitespace-nowrap px-3 py-2 md:px-3.5 md:py-2.5 rounded-lg transition-colors flex items-center gap-2 shrink-0 md:w-full ${
                  activeTab === 'products' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-sand/80 hover:bg-white/10'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Kurtis ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`whitespace-nowrap px-3 py-2 md:px-3.5 md:py-2.5 rounded-lg transition-colors flex items-center gap-2 shrink-0 md:w-full ${
                  activeTab === 'orders' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-sand/80 hover:bg-white/10'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`whitespace-nowrap px-3 py-2 md:px-3.5 md:py-2.5 rounded-lg transition-colors flex items-center gap-2 shrink-0 md:w-full ${
                  activeTab === 'reviews' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-sand/80 hover:bg-white/10'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Reviews ({reviews.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`whitespace-nowrap px-3 py-2 md:px-3.5 md:py-2.5 rounded-lg transition-colors flex items-center gap-2 shrink-0 md:w-full ${
                  activeTab === 'customers' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-sand/80 hover:bg-white/10'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customers ({customers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reels')}
                className={`whitespace-nowrap px-3 py-2 md:px-3.5 md:py-2.5 rounded-lg transition-colors flex items-center gap-2 shrink-0 md:w-full ${
                  activeTab === 'reels' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-sand/80 hover:bg-white/10'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video Drops ({reels.length})</span>
              </button>
            </nav>
          </div>

          <div className="pt-3 border-t border-white/10 text-xs hidden md:block">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-center"
            >
              Close Admin Console
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-brand-bg/50">
          <div className="p-3 sm:p-4 px-3 sm:px-6 bg-white border-b border-brand-border flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-brand-dark">
              Admin: {activeTab.toUpperCase()}
            </span>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={fetchAllAdminData}
                className="p-1.5 text-brand-muted hover:text-brand-dark rounded-full hover:bg-brand-sand/40"
                title="Refresh Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-brand-dark/70 hover:text-brand-dark rounded-full hover:bg-brand-sand/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 sm:p-6">
            {/* 1. DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-brand-border shadow-xs">
                    <span className="text-xs text-brand-muted uppercase font-semibold">Total Revenue (Paid)</span>
                    <h3 className="text-2xl font-bold text-brand-dark mt-1 font-sans">
                      ₹{metrics.totalRevenue?.toLocaleString('en-IN')}
                    </h3>
                    <span className="text-[11px] text-emerald-700 font-medium">100% Razorpay Online</span>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-brand-border shadow-xs">
                    <span className="text-xs text-brand-muted uppercase font-semibold">Total Orders</span>
                    <h3 className="text-2xl font-bold text-brand-dark mt-1 font-sans">
                      {metrics.totalOrders} Orders
                    </h3>
                    <span className="text-[11px] text-brand-muted">Pan-India Shipments</span>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-brand-border shadow-xs">
                    <span className="text-xs text-brand-muted uppercase font-semibold">Active Kurtis & Sets</span>
                    <h3 className="text-2xl font-bold text-brand-dark mt-1 font-sans">
                      {metrics.totalProducts} Designs
                    </h3>
                    <span className="text-[11px] text-brand-primary font-medium">In Store</span>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-brand-border shadow-xs">
                    <span className="text-xs text-brand-muted uppercase font-semibold">Registered Customers</span>
                    <h3 className="text-2xl font-bold text-brand-dark mt-1 font-sans">
                      {metrics.totalCustomers} Accounts
                    </h3>
                    <span className="text-[11px] text-blue-700 font-medium">Verified Patrons</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((st) => (
                    <div key={st} className="p-3 bg-white rounded-lg border border-brand-border/80 text-xs">
                      <span className="text-brand-muted uppercase text-[10px] font-semibold">{st}</span>
                      <div className="text-lg font-bold text-brand-dark">{statusCounts[st] || 0}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl border border-brand-border p-5 shadow-xs">
                  <h4 className="font-serif text-lg font-semibold text-brand-dark mb-3">Recent Customer Purchases</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-brand-border text-brand-muted font-semibold uppercase text-[10px]">
                          <th className="pb-2">Order ID</th>
                          <th className="pb-2">Customer</th>
                          <th className="pb-2">Amount</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2">Courier Tracking AWB</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/40">
                        {recentOrders.map((o) => (
                          <tr key={o.orderId} className="hover:bg-brand-bg/50">
                            <td className="py-2.5 font-mono font-bold text-brand-dark">{o.orderId}</td>
                            <td className="py-2.5 text-brand-dark">{o.customerName}</td>
                            <td className="py-2.5 font-bold">₹{o.total?.toLocaleString('en-IN')}</td>
                            <td className="py-2.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-primaryLight text-brand-primary">
                                {o.status}
                              </span>
                            </td>
                            <td className="py-2.5 font-mono text-brand-muted">{o.trackingId || 'Pending'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PRODUCTS CRUD */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <h4 className="font-serif text-lg font-semibold text-brand-dark">Kurti Collection ({products.length})</h4>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        category: 'Short Kurtis',
                        price: '',
                        originalPrice: '',
                        stock: 50,
                        inStock: true,
                        sizes: ['XS', 'S', 'M', 'L', 'XL'],
                        outOfStockSizes: [],
                        fabric: '100% Pure Jaipur Mulmul Cotton',
                        craft: 'Handblock Wooden Print',
                        stylingTips: 'Pair with relaxed white linen trousers or slim-fit denim.',
                        washCare: 'Gentle hand wash in cold water.',
                        images: [
                          'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80',
                          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
                        ],
                        image: '',
                        badge: 'New Arrival'
                      });
                      setIsAddProductOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Kurti</span>
                  </button>
                </div>

                {isAddProductOpen && (
                  <div className="p-5 bg-white rounded-xl border-2 border-brand-primary/40 shadow-xl space-y-4 text-xs animate-scaleUp max-h-[85vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h5 className="font-serif text-base font-bold text-brand-dark">
                          {editingProduct ? `Edit Silhouette: ${editingProduct.name}` : 'Add New Ethnic Silhouette'}
                        </h5>
                        <p className="text-[11px] text-brand-muted">
                          Configure multi-photo angles, inventory stock, sizes, and artisan details.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsAddProductOpen(false)}
                        className="p-1 rounded-md text-brand-muted hover:text-brand-dark hover:bg-brand-sand/50"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* 1. Title */}
                      <div className="md:col-span-2">
                        <label className="block font-semibold mb-1 text-brand-dark">Kurti / Set Title *</label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="e.g. Gulzar Floral Handblock Short Kurti"
                          className="w-full border rounded-lg p-2.5 bg-brand-bg/40 focus:outline-none focus:border-brand-primary font-medium"
                        />
                      </div>

                      {/* 2. Category */}
                      <div>
                        <label className="block font-semibold mb-1 text-brand-dark">Ethnic Category *</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => {
                            const newCat = e.target.value;
                            const recommended = CATEGORY_SIZE_PRESETS[newCat] || ['XS', 'S', 'M', 'L', 'XL'];
                            const wasBottom = productForm.category === 'Ethnic Bottoms';
                            const isNowBottom = newCat === 'Ethnic Bottoms';
                            const newSizes = (wasBottom !== isNowBottom) ? recommended : (productForm.sizes || recommended);
                            setProductForm({
                              ...productForm,
                              category: newCat,
                              sizes: newSizes,
                              outOfStockSizes: []
                            });
                          }}
                          className="w-full border rounded-lg p-2.5 bg-brand-bg/40 font-medium text-brand-dark focus:outline-none focus:border-brand-primary"
                        >
                          <option value="Short Kurtis">Short Kurtis (Trending Tops)</option>
                          <option value="Long Kurtis">Long Kurtis (Classic A-Line & Straight)</option>
                          <option value="Kurti Sets">Kurti Sets (2 & 3 Piece Festive Ensembles)</option>
                          <option value="Ethnic Bottoms">Ethnic Bottoms (Pants, Palazzos & Salwars)</option>
                          <option value="Co-ord Sets">Co-ord Sets (Matching Tunic & Trouser Duos)</option>
                        </select>
                      </div>

                      {/* 3. Badge Tag */}
                      <div>
                        <label className="block font-semibold mb-1 text-brand-dark">Badge Tag</label>
                        <input
                          type="text"
                          value={productForm.badge}
                          onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                          placeholder="e.g. Bestseller, Festive Pick, New Arrival"
                          className="w-full border rounded-lg p-2.5 bg-brand-bg/40 focus:outline-none focus:border-brand-primary"
                        />
                      </div>

                      {/* 4. Selling & Original Price */}
                      <div>
                        <label className="block font-semibold mb-1 text-brand-dark">Selling Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          placeholder="1299"
                          className="w-full border rounded-lg p-2.5 bg-brand-bg/40 font-bold text-brand-primary focus:outline-none focus:border-brand-primary"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-brand-dark">Original MRP (₹)</label>
                        <input
                          type="number"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                          placeholder="1899"
                          className="w-full border rounded-lg p-2.5 bg-brand-bg/40 focus:outline-none focus:border-brand-primary"
                        />
                      </div>

                      {/* 5. OVERALL STOCK AVAILABILITY TOGGLE & QUANTITY */}
                      <div className="md:col-span-2 p-3.5 bg-brand-sand/30 rounded-xl border border-brand-border space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <label className="block font-semibold text-brand-dark text-xs">
                              Master Product Stock Availability *
                            </label>
                            <p className="text-[10px] text-brand-muted">
                              Mark whether this entire silhouette is currently Available to Order or Sold Out.
                            </p>
                          </div>

                          {/* In Stock / Out of Stock Switch */}
                          <div className="inline-flex rounded-lg p-1 bg-white border border-brand-border shadow-2xs">
                            <button
                              type="button"
                              onClick={() => setProductForm({
                                ...productForm,
                                inStock: true,
                                stock: productForm.stock <= 0 ? 50 : productForm.stock
                              })}
                              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                                productForm.inStock
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-neutral-600 hover:text-brand-dark'
                              }`}
                            >
                              <span className="w-2 h-2 rounded-full bg-white"></span>
                              <span>In Stock</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setProductForm({ ...productForm, inStock: false })}
                              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                                !productForm.inStock
                                  ? 'bg-red-600 text-white shadow-xs'
                                  : 'text-neutral-600 hover:text-brand-dark'
                              }`}
                            >
                              <span className="w-2 h-2 rounded-full bg-white"></span>
                              <span>Out of Stock</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2 border-t border-brand-border/40">
                          <label className="text-[11px] font-semibold text-brand-dark shrink-0">
                            Available Inventory Units:
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={productForm.stock}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setProductForm({
                                ...productForm,
                                stock: val,
                                inStock: val > 0 ? productForm.inStock : false
                              });
                            }}
                            className="w-24 border rounded-lg p-1.5 text-xs bg-white text-center font-bold"
                          />
                          <span className="text-[10px] font-medium text-brand-muted">
                            {productForm.inStock ? '✓ Purchasable on storefront' : '✕ Customer will see "Sold Out"'}
                          </span>
                        </div>
                      </div>

                      {/* 6. CATEGORY SIZES & PER-SIZE OUT OF STOCK MANAGER */}
                      <div className="md:col-span-2 p-3.5 bg-brand-sand/30 rounded-xl border border-brand-border space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <label className="block font-semibold text-brand-dark text-xs">
                              Size Availability & Per-Size Stock Status ({productForm.category})
                            </label>
                            <p className="text-[10px] text-brand-muted">
                              Select manufactured sizes. Click the button on any size to toggle between <strong className="text-emerald-700">In Stock</strong> and <strong className="text-red-600">Out of Stock</strong>.
                            </p>
                          </div>

                          {/* Category Presets Quick Bar */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-brand-muted">Presets:</span>
                            {(CATEGORY_SIZE_PRESETS[productForm.category] || []).map((presetSz) => {
                              const isSelected = (productForm.sizes || []).includes(presetSz);
                              return (
                                <button
                                  key={presetSz}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setProductForm({
                                        ...productForm,
                                        sizes: (productForm.sizes || []).filter(s => s !== presetSz),
                                        outOfStockSizes: (productForm.outOfStockSizes || []).filter(s => s !== presetSz)
                                      });
                                    } else {
                                      setProductForm({
                                        ...productForm,
                                        sizes: [...(productForm.sizes || []), presetSz]
                                      });
                                    }
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                                    isSelected
                                      ? 'bg-brand-dark text-white border-brand-dark'
                                      : 'bg-white text-brand-muted border-brand-border hover:border-brand-dark'
                                  }`}
                                >
                                  {presetSz}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Active Sizes Pill Manager */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {(productForm.sizes || []).map((sz) => {
                            const isOut = (productForm.outOfStockSizes || []).includes(sz);
                            return (
                              <div
                                key={sz}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-2xs transition ${
                                  isOut
                                    ? 'bg-red-50/80 border-red-300 text-red-900'
                                    : 'bg-white border-emerald-300 text-emerald-950'
                                }`}
                              >
                                <span className="font-bold text-xs">{sz}</span>

                                {/* Stock Toggle Pill */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isOut) {
                                      setProductForm({
                                        ...productForm,
                                        outOfStockSizes: (productForm.outOfStockSizes || []).filter(s => s !== sz)
                                      });
                                    } else {
                                      setProductForm({
                                        ...productForm,
                                        outOfStockSizes: [...(productForm.outOfStockSizes || []), sz]
                                      });
                                    }
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition ${
                                    isOut
                                      ? 'bg-red-600 text-white hover:bg-red-700'
                                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  }`}
                                  title="Click to toggle size stock status"
                                >
                                  {isOut ? '✕ Out of Stock' : '✓ In Stock'}
                                </button>

                                {/* Remove size */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProductForm({
                                      ...productForm,
                                      sizes: (productForm.sizes || []).filter(s => s !== sz),
                                      outOfStockSizes: (productForm.outOfStockSizes || []).filter(s => s !== sz)
                                    });
                                  }}
                                  className="text-neutral-400 hover:text-red-500 transition ml-0.5"
                                  title="Remove size from product"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}

                          {(productForm.sizes || []).length === 0 && (
                            <p className="text-red-500 text-xs italic">Please select or add at least one size.</p>
                          )}
                        </div>

                        {/* Custom Size Adder */}
                        <div className="flex items-center gap-2 pt-2 border-t border-brand-border/40">
                          <input
                            type="text"
                            placeholder="Add custom size (e.g. Free Size, 38, 4XL)"
                            value={customSizeInput}
                            onChange={(e) => setCustomSizeInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (customSizeInput.trim() && !(productForm.sizes || []).includes(customSizeInput.trim())) {
                                  setProductForm({
                                    ...productForm,
                                    sizes: [...(productForm.sizes || []), customSizeInput.trim()]
                                  });
                                  setCustomSizeInput('');
                                }
                              }
                            }}
                            className="border rounded-lg px-2.5 py-1.5 text-xs bg-white w-56 focus:outline-none focus:border-brand-primary"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customSizeInput.trim() && !(productForm.sizes || []).includes(customSizeInput.trim())) {
                                setProductForm({
                                  ...productForm,
                                  sizes: [...(productForm.sizes || []), customSizeInput.trim()]
                                });
                                setCustomSizeInput('');
                              }
                            }}
                            className="px-3.5 py-1.5 bg-brand-dark text-white rounded-lg text-xs font-semibold hover:bg-brand-primary transition"
                          >
                            + Add Size
                          </button>
                        </div>
                      </div>

                      {/* 7. MULTI-PHOTO GALLERY URLS MANAGER */}
                      <div className="md:col-span-2 space-y-2.5 bg-brand-sand/30 p-3.5 rounded-xl border border-brand-border">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block font-semibold text-brand-dark text-xs">
                              Product Photos Gallery (Multiple Photo URLs) *
                            </label>
                            <p className="text-[10px] text-brand-muted">
                              Add multiple photos (Front look, twirl angle, fabric detail, back). #1 is the Primary Cover.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setProductForm(prev => ({
                                ...prev,
                                images: [...(prev.images || []), '']
                              }));
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-primaryDark transition shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Photo URL</span>
                          </button>
                        </div>

                        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                          {(productForm.images && productForm.images.length > 0 ? productForm.images : ['']).map((url, idx) => (
                            <div key={idx} className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-brand-border shadow-2xs">
                              {/* Thumbnail Preview */}
                              <div
                                className="w-12 h-16 rounded-md bg-brand-sand/60 overflow-hidden shrink-0 border border-brand-border/60 flex items-center justify-center relative"
                                style={{ width: '48px', height: '64px', minWidth: '48px' }}
                              >
                                {url ? (
                                  <img
                                    src={url}
                                    alt={`Angle ${idx + 1}`}
                                    className="w-full h-full object-cover object-top block"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                ) : (
                                  <span className="text-[9px] text-brand-muted font-mono font-bold">#{idx + 1}</span>
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-bold tracking-wide uppercase text-brand-dark">
                                    {idx === 0
                                      ? '★ #1 Primary Cover (Catalog Grid)'
                                      : idx === 1
                                      ? '✦ #2 Hover Angle (Twirl / Movement)'
                                      : `#${idx + 1} Detail Angle (Fabric / Craft / Back)`}
                                  </span>
                                </div>
                                <input
                                  type="url"
                                  value={url}
                                  onChange={(e) => {
                                    const newImgs = [...(productForm.images || [])];
                                    newImgs[idx] = e.target.value;
                                    setProductForm({ ...productForm, images: newImgs });
                                  }}
                                  placeholder={idx === 0 ? "https://... (Front primary image URL)" : "https://... (Angle or detail photo URL)"}
                                  className="w-full border rounded-lg p-1.5 text-xs bg-brand-bg/40 focus:outline-none focus:border-brand-primary font-mono"
                                />
                              </div>

                              {(productForm.images || []).length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImgs = (productForm.images || []).filter((_, i) => i !== idx);
                                    setProductForm({ ...productForm, images: newImgs.length > 0 ? newImgs : [''] });
                                  }}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
                                  title="Remove this photo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 8. Fabric & Craft */}
                      <div>
                        <label className="block font-semibold mb-1 text-brand-dark">Fabric</label>
                        <input
                          type="text"
                          value={productForm.fabric}
                          onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                          placeholder="e.g. 100% Pure Jaipur Mulmul Cotton"
                          className="w-full border rounded-lg p-2 bg-brand-bg/40"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-brand-dark">Craft / Printing Technique</label>
                        <input
                          type="text"
                          value={productForm.craft}
                          onChange={(e) => setProductForm({ ...productForm, craft: e.target.value })}
                          placeholder="e.g. Handblock Wooden Print"
                          className="w-full border rounded-lg p-2 bg-brand-bg/40"
                        />
                      </div>

                      {/* Modal Footer */}
                      <div className="md:col-span-2 flex justify-end gap-2.5 pt-3 border-t border-brand-border">
                        <button
                          type="button"
                          onClick={() => setIsAddProductOpen(false)}
                          className="px-5 py-2.5 border rounded-lg hover:bg-brand-sand/50 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primaryDark text-white font-semibold rounded-lg shadow-md transition"
                        >
                          {editingProduct ? 'Update Silhouette' : 'Save Kurti to Catalog'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => {
                    const isOutOfStock = !p.inStock || p.stock <= 0;
                    return (
                      <div key={p.id} className="bg-white p-3.5 rounded-xl border border-brand-border flex gap-3 shadow-xs hover:border-brand-primary/40 transition overflow-hidden min-w-0">
                        {/* Fixed Sized Thumbnail Container */}
                        <div
                          className="relative w-24 h-32 shrink-0 rounded-lg overflow-hidden bg-brand-sand/40 border border-brand-border/60"
                          style={{ width: '96px', height: '128px', minWidth: '96px', minHeight: '128px', maxWidth: '96px', maxHeight: '128px' }}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover object-top block"
                          />
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-1 text-center">
                              <span className="text-[8px] font-bold text-white uppercase tracking-wider bg-red-600 px-1 py-0.5 rounded">
                                Sold Out
                              </span>
                            </div>
                          )}
                          {Array.isArray(p.images) && p.images.length > 1 && (
                            <div className="absolute bottom-1 right-1 bg-black/75 text-white text-[8px] font-mono px-1.5 py-0.5 rounded backdrop-blur-xs">
                              {p.images.length} photos
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between text-xs overflow-hidden">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <h5 className="font-serif font-semibold text-brand-dark truncate">{p.name}</h5>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                                isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {isOutOfStock ? 'Out of Stock' : `In Stock (${p.stock || 50})`}
                              </span>
                            </div>

                            <span className="text-[10px] text-brand-muted uppercase tracking-wider">
                              {p.category}
                            </span>
                            <div className="font-bold text-brand-primary text-sm mt-0.5">
                              ₹{p.price?.toLocaleString('en-IN')}
                            </div>

                            {/* Sizes & Stock status pills */}
                            {p.sizes && p.sizes.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {p.sizes.map((sz) => {
                                  const isSzOut = (p.outOfStockSizes || []).includes(sz);
                                  return (
                                    <span
                                      key={sz}
                                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                                        isSzOut
                                          ? 'bg-red-50 text-red-600 line-through border border-red-200'
                                          : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                                      }`}
                                      title={isSzOut ? `Size ${sz} is Out of Stock` : `Size ${sz} In Stock`}
                                    >
                                      {sz}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-brand-border/40 mt-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                const resolvedImages = Array.isArray(p.images) && p.images.length > 0
                                  ? p.images
                                  : [p.image, p.hoverImage].filter(Boolean);
                                setProductForm({
                                  ...p,
                                  inStock: p.inStock !== undefined ? p.inStock : (p.stock !== undefined ? p.stock > 0 : true),
                                  stock: p.stock !== undefined ? p.stock : 50,
                                  sizes: Array.isArray(p.sizes) && p.sizes.length > 0
                                    ? p.sizes
                                    : (p.category === 'Ethnic Bottoms' ? ['28', '30', '32', '34', '36'] : ['XS', 'S', 'M', 'L', 'XL']),
                                  outOfStockSizes: Array.isArray(p.outOfStockSizes) ? p.outOfStockSizes : [],
                                  images: resolvedImages.length > 0 ? resolvedImages : ['']
                                });
                                setIsAddProductOpen(true);
                              }}
                              className="text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold text-[11px]"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-red-600 hover:underline inline-flex items-center gap-1 font-semibold text-[11px] ml-auto"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. ORDERS & TRACKING MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg font-semibold text-brand-dark pb-2 border-b">
                  Orders & Courier Tracking (AWB) Upload
                </h4>

                {selectedOrderForTracking && (
                  <div className="p-4 bg-white rounded-xl border-2 border-brand-primary shadow-xl space-y-3 text-xs mb-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h5 className="font-serif font-bold text-brand-dark text-sm">
                        Assign Tracking ID for Order #{selectedOrderForTracking.orderId}
                      </h5>
                      <button onClick={() => setSelectedOrderForTracking(null)}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-medium mb-1">Courier Partner *</label>
                        <select
                          value={courierPartner}
                          onChange={(e) => setCourierPartner(e.target.value)}
                          className="w-full border rounded-lg p-2 bg-brand-bg/40"
                        >
                          <option value="BlueDart Express">BlueDart Express</option>
                          <option value="Delhivery Logistics">Delhivery Logistics</option>
                          <option value="DTDC India">DTDC India</option>
                          <option value="Shiprocket">Shiprocket</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Tracking Number (AWB) *</label>
                        <input
                          type="text"
                          required
                          value={trackingId}
                          onChange={(e) => setTrackingId(e.target.value)}
                          placeholder="e.g. BD84920199IN"
                          className="w-full border rounded-lg p-2 bg-brand-bg/40 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Direct Courier Tracking URL</label>
                        <input
                          type="url"
                          value={trackingUrl}
                          onChange={(e) => setTrackingUrl(e.target.value)}
                          placeholder="https://www.delhivery.com/track/package/..."
                          className="w-full border rounded-lg p-2 bg-brand-bg/40"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderForTracking(null)}
                        className="px-4 py-1.5 border rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveTracking(selectedOrderForTracking.orderId)}
                        className="px-6 py-1.5 bg-brand-primary text-white font-semibold rounded-lg"
                      >
                        Save & Update Customer Profile
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o.orderId} className="bg-white p-4 rounded-xl border border-brand-border space-y-3 text-xs shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
                        <div>
                          <span className="font-mono font-bold text-sm text-brand-dark">{o.orderId}</span>
                          <span className="text-[10px] text-brand-muted ml-2">
                            {new Date(o.createdAt).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                            className="border rounded-md px-2 py-1 text-[11px] font-bold uppercase bg-brand-bg"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>

                          <button
                            onClick={() => {
                              setSelectedOrderForTracking(o);
                              setCourierPartner(o.courierPartner || 'BlueDart Express');
                              setTrackingId(o.trackingId || '');
                              setTrackingUrl(o.trackingUrl || '');
                            }}
                            className="px-3 py-1 bg-brand-dark hover:bg-brand-primary text-white rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>{o.trackingId ? 'Edit Tracking' : 'Upload Tracking ID'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-brand-muted">Customer:</span>
                          <p className="font-semibold text-brand-dark mt-0.5">{o.customerName}</p>
                          <p className="text-[11px] text-brand-muted">{o.customerEmail}</p>
                          <p className="text-[11px] text-brand-muted">{o.customerPhone}</p>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-brand-muted">Delivery Address:</span>
                          <p className="text-brand-dark mt-0.5">{o.shippingAddress}</p>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-brand-muted">Payment & Tracking:</span>
                          <p className="text-emerald-700 font-semibold mt-0.5">Razorpay Online Paid (₹{o.total?.toLocaleString('en-IN')})</p>
                          {o.trackingId ? (
                            <p className="font-mono text-brand-primary font-bold mt-1">
                              {o.courierPartner}: {o.trackingId}
                            </p>
                          ) : (
                            <p className="text-amber-700 italic mt-1">No Tracking Assigned Yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. REVIEWS MODERATION */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg font-semibold text-brand-dark pb-2 border-b">
                  Customer Reviews ({reviews.length})
                </h4>
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-4 rounded-xl border border-brand-border flex items-start justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-brand-dark">{rev.userName}</span>
                          <div className="flex text-amber-500">
                            {[...Array(rev.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                          <span className="text-[10px] text-brand-muted">Item: {rev.productName}</span>
                        </div>
                        <p className="text-brand-dark/90 leading-relaxed font-light">"{rev.comment}"</p>
                      </div>

                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. CUSTOMERS LIST */}
            {activeTab === 'customers' && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg font-semibold text-brand-dark pb-2 border-b">
                  Registered Customers ({customers.length})
                </h4>
                <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-brand-bg/80 border-b text-[10px] uppercase font-bold text-brand-muted">
                      <tr>
                        <th className="p-3">Customer Name</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Orders Placed</th>
                        <th className="p-3">Default Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/40">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-brand-bg/40">
                          <td className="p-3 font-semibold text-brand-dark">{c.name}</td>
                          <td className="p-3 text-brand-muted">{c.email}</td>
                          <td className="p-3 text-brand-dark">{c.phone || 'N/A'}</td>
                          <td className="p-3 font-bold text-brand-primary">{c.ordersCount || 0} Orders</td>
                          <td className="p-3 text-brand-muted truncate max-w-xs">{c.address || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. VIDEO DROPS / REELS MANAGEMENT */}
            {activeTab === 'reels' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b">
                  <div>
                    <h4 className="font-serif text-lg font-semibold text-brand-dark">
                      Video Drops & In-Motion Reels ({reels.length})
                    </h4>
                    <p className="text-xs text-brand-muted">
                      Videos uploaded here appear in the storefront "In Motion & Moments" horizontal carousel.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddReelOpen(true)}
                    className="bg-brand-primary hover:bg-brand-primaryDark text-white px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Video Drop</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reels.map((r) => (
                    <div key={r.id} className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-xs flex flex-col">
                      <div className="relative aspect-[16/9] bg-black overflow-hidden group">
                        <img
                          src={r.coverImage}
                          alt={r.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.meesho.com/images/products/1096061321/8kuz6_512.avif?width=512';
                          }}
                          className="w-full h-full object-cover opacity-85"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center shadow-md">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-xs">
                          <span>{r.views || '1K'} Views</span>
                          <span>{r.likes || '100'} Likes</span>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                          Tagged: {r.productName || 'Kurti Silhouette'}
                        </span>
                        <h5 className="font-serif font-medium text-xs text-brand-dark mt-1 line-clamp-2">
                          {r.title}
                        </h5>
                        <div className="mt-auto pt-3 border-t border-brand-border/60 flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-dark">
                            ₹{r.productPrice?.toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => handleDeleteReel(r.id)}
                            className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Reel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD / UPLOAD NEW VIDEO DROP */}
      {/* ============================================================== */}
      {isAddReelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-brand-border text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div>
                <h4 className="font-serif text-lg font-semibold text-brand-dark">
                  Publish New Video Drop
                </h4>
                <p className="text-[11px] text-brand-muted">Add a vertical video or kurti try-on reel for the storefront.</p>
              </div>
              <button onClick={() => setIsAddReelOpen(false)} className="text-brand-muted hover:text-brand-dark p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReel} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase text-brand-muted mb-1">
                  Step 1: Link Featured Kurti Silhouette (Optional)
                </label>
                <select
                  value={reelForm.productId}
                  onChange={(e) => {
                    const selected = products.find(p => p.id === e.target.value);
                    setReelForm({
                      ...reelForm,
                      productId: e.target.value,
                      productName: selected ? selected.name : '',
                      productPrice: selected ? selected.price : '',
                      title: reelForm.title || (selected ? `Styling ${selected.name} • Try-On Drop` : ''),
                      coverImage: selected?.image || reelForm.coverImage
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none bg-brand-sand/20 font-medium"
                >
                  <option value="">Select a kurti from catalog...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.price?.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-brand-muted block mt-0.5">
                  Selecting a kurti automatically links its photo, name, and price to this video drop!
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-brand-muted mb-1">
                  Video Reel Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 32-Kali Twirl Test: Royal Anarkali Set in Action"
                  value={reelForm.title}
                  onChange={(e) => setReelForm({ ...reelForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-brand-muted mb-1">
                  Video Stream URL (MP4 / Web Video) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://.../video.mp4"
                  value={reelForm.videoUrl}
                  onChange={(e) => setReelForm({ ...reelForm, videoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none font-mono text-[11px]"
                />
                <span className="text-[10px] text-brand-muted block mt-0.5">
                  Enter direct MP4 link, Vimeo/CDN stream, or video URL.
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-brand-muted mb-1">
                  Thumbnail Cover Image URL *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={reelForm.coverImage}
                    onChange={(e) => setReelForm({ ...reelForm, coverImage: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none font-mono text-[11px]"
                  />
                  {reelForm.coverImage && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-brand-border shrink-0 bg-brand-sand">
                      <img
                        src={reelForm.coverImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-brand-muted mb-1">
                  Hashtags / Labels
                </label>
                <input
                  type="text"
                  placeholder="#NailmoresCouture, #KurtiTwirl, #JaipurCraft"
                  value={reelForm.tags}
                  onChange={(e) => setReelForm({ ...reelForm, tags: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsAddReelOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-dark hover:bg-brand-sand/40 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white font-semibold uppercase tracking-wider shadow-sm"
                >
                  Publish Video Drop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
