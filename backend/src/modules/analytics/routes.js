import { Router } from 'express';
import { readDB } from '../../config/database.js';
import { requireAdmin } from '../../core/authMiddleware.js';

const router = Router();

// Admin: Get Analytics Overview
router.get('/dashboard', requireAdmin, (req, res) => {
  const db = readDB();

  const totalRevenue = db.orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = db.orders.length;
  const totalProducts = db.products.length;
  const totalCustomers = db.users.filter(u => u.role !== 'admin').length;

  // Order status counts
  const statusCounts = {
    Confirmed: 0,
    Processing: 0,
    Shipped: 0,
    Delivered: 0
  };

  db.orders.forEach(o => {
    if (statusCounts[o.status] !== undefined) {
      statusCounts[o.status]++;
    }
  });

  // Recent 5 orders
  const recentOrders = [...db.orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  res.json({
    metrics: {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers
    },
    statusCounts,
    recentOrders
  });
});

export default router;

