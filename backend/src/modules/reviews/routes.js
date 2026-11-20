import { Router } from 'express';
import { readDB, writeDB } from '../../config/database.js';
import { requireAuth, requireAdmin } from '../../core/authMiddleware.js';

const router = Router();

// Public: Get all approved reviews
router.get('/', (req, res) => {
  const db = readDB();
  const approved = db.reviews.filter(r => r.status === 'approved');
  res.json({ count: approved.length, reviews: approved });
});

// Public: Get reviews for a specific product
router.get('/product/:productId', (req, res) => {
  const db = readDB();
  const productReviews = db.reviews.filter(
    r => r.productId === req.params.productId && r.status === 'approved'
  );
  res.json({ count: productReviews.length, reviews: productReviews });
});

// User: Get all reviews submitted by the authenticated user
router.get('/my-reviews', requireAuth, (req, res) => {
  const db = readDB();
  const myReviews = (db.reviews || []).filter(r => r.userId === req.user.id);
  res.json({ count: myReviews.length, reviews: myReviews });
});

// User: Submit a Review (Protected)
router.post('/', requireAuth, (req, res) => {
  const { productId, productName, rating, comment } = req.body;
  if (!productId || !rating || !comment) {
    return res.status(400).json({ error: 'Product ID, rating (1-5), and comment are required.' });
  }

  const db = readDB();
  const newReview = {
    id: `rev-${Date.now()}`,
    productId,
    productName: productName || 'Artisanal Ethnic Wear',
    userId: req.user.id,
    userName: req.user.name || 'Verified Patron',
    rating: Number(rating),
    comment,
    status: 'approved', // Auto-approved or can be moderated by Admin
    createdAt: new Date().toISOString()
  };

  db.reviews.unshift(newReview);
  writeDB(db);

  res.status(201).json({ message: 'Review submitted successfully', review: newReview });
});

// Admin: Get all reviews (including moderation status)
router.get('/admin/all', requireAdmin, (req, res) => {
  const db = readDB();
  res.json({ count: db.reviews.length, reviews: db.reviews });
});

// Admin: Moderate review status (approve / reject)
router.put('/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  const db = readDB();
  const index = db.reviews.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Review not found.' });
  }

  db.reviews[index].status = status;
  writeDB(db);

  res.json({ message: 'Review status updated', review: db.reviews[index] });
});

// Admin: Delete review
router.delete('/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const initialLength = db.reviews.length;
  db.reviews = db.reviews.filter(r => r.id !== req.params.id);

  if (db.reviews.length === initialLength) {
    return res.status(404).json({ error: 'Review not found.' });
  }

  writeDB(db);
  res.json({ message: 'Review deleted successfully.' });
});

export default router;

