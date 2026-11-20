import { Router } from 'express';
import { readDB, writeDB } from '../../config/database.js';
import { requireAuth, requireAdmin } from '../../core/authMiddleware.js';

const router = Router();

// User: Get My Orders with Tracking Details (Protected)
router.get('/my-orders', requireAuth, (req, res) => {
  const db = readDB();
  const myOrders = db.orders.filter(o => o.userId === req.user.id);
  // Sort latest first
  myOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ count: myOrders.length, orders: myOrders });
});

// Admin: Get All Orders (Admin only)
router.get('/', requireAdmin, (req, res) => {
  const db = readDB();
  const sorted = [...db.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ count: sorted.length, orders: sorted });
});

// Admin: Upload / Update Courier Tracking ID & Partner
router.put('/:orderId/tracking', requireAdmin, (req, res) => {
  const { orderId } = req.params;
  const { courierPartner, trackingId, trackingUrl, status } = req.body;

  if (!trackingId) {
    return res.status(400).json({ error: 'Tracking ID (AWB) is required.' });
  }

  const db = readDB();
  const orderIndex = db.orders.findIndex(o => o.orderId === orderId);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  db.orders[orderIndex].courierPartner = courierPartner || db.orders[orderIndex].courierPartner || 'Delhivery Express';
  db.orders[orderIndex].trackingId = trackingId;
  db.orders[orderIndex].trackingUrl = trackingUrl || `https://www.delhivery.com/track/package/${trackingId}`;
  if (status) {
    db.orders[orderIndex].status = status;
  } else if (db.orders[orderIndex].status === 'Confirmed' || db.orders[orderIndex].status === 'Processing') {
    db.orders[orderIndex].status = 'Shipped';
  }

  writeDB(db);
  res.json({ message: 'Tracking details updated successfully', order: db.orders[orderIndex] });
});

// Admin: Update Order Status (Processing, Shipped, Delivered)
router.put('/:orderId/status', requireAdmin, (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  const db = readDB();
  const orderIndex = db.orders.findIndex(o => o.orderId === orderId);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  db.orders[orderIndex].status = status;
  writeDB(db);

  res.json({ message: 'Order status updated successfully', order: db.orders[orderIndex] });
});

export default router;

