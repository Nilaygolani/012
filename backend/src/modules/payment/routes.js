import { Router } from 'express';
import crypto from 'crypto';
import { razorpayInstance, key_id, key_secret } from '../../config/razorpay.js';
import { readDB, writeDB } from '../../config/database.js';
import { requireAuth } from '../../core/authMiddleware.js';

const router = Router();

// Create Razorpay Order (Protected - User must be logged in)
router.post('/create-order', requireAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required.' });
    }

    const receipt = `rcpt_${Date.now()}`;
    const amountInPaise = Math.round(Number(amount) * 100);

    // If live Razorpay instance exists, use it
    if (razorpayInstance) {
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        payment_capture: 1
      };
      const order = await razorpayInstance.orders.create(options);
      return res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: key_id
      });
    }

    // Demo/Sandbox fallback mode (works seamlessly until user adds live keys)
    const mockOrderId = `order_rzp_${Date.now()}`;
    res.json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      key: key_id,
      isDemoMode: true,
      message: 'Running in Razorpay demo mode. Add real keys in backend/.env for live gateway.'
    });
  } catch (err) {
    console.error('[Razorpay Order Creation Error]:', err);
    res.status(500).json({ error: 'Failed to create payment order.' });
  }
});

// Verify Payment Signature & Confirm Customer Order (Protected)
router.post('/verify-and-confirm', requireAuth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      total,
      shippingAddress,
      customerPhone,
      isDemoMode
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required.' });
    }

    // If live Razorpay keys are configured, verify HMAC SHA256 signature
    if (razorpayInstance && !isDemoMode) {
      const generatedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ error: 'Payment verification failed: Invalid signature.' });
      }
    }

    // Payment Verified! Now create order in database
    const db = readDB();
    const orderId = `NLM-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      orderId,
      userId: req.user.id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: customerPhone || req.user.phone || '',
      shippingAddress: shippingAddress || 'Handcrafted Delivery Address',
      items,
      total: Number(total),
      paymentMethod: 'Razorpay Online',
      paymentId: razorpay_payment_id || `pay_${Date.now()}`,
      paymentStatus: 'Paid',
      status: 'Confirmed',
      courierPartner: 'BlueDart Express',
      trackingId: `BD${Math.floor(10000000 + Math.random() * 90000000)}IN`,
      trackingUrl: `https://www.bluedart.com/tracking`,
      createdAt: new Date().toISOString()
    };

    // Deduct stock from products
    items.forEach(item => {
      const pIndex = db.products.findIndex(p => p.id === item.id);
      if (pIndex > -1 && db.products[pIndex].stock) {
        db.products[pIndex].stock = Math.max(0, db.products[pIndex].stock - (item.quantity || 1));
      }
    });

    db.orders.unshift(newOrder);
    writeDB(db);

    res.status(201).json({
      success: true,
      message: 'Payment verified and order placed successfully!',
      order: newOrder
    });
  } catch (err) {
    console.error('[Payment Verification Error]:', err);
    res.status(500).json({ error: 'Error during order processing.' });
  }
});

export default router;

