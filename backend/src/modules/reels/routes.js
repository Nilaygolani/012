import { Router } from 'express';
import { readDB, writeDB } from '../../config/database.js';

const router = Router();

// Public: Get all video reels
router.get('/', (req, res) => {
  const db = readDB();
  const reels = db.reels || [];
  res.json({ count: reels.length, reels });
});

// Public: Get single reel
router.get('/:id', (req, res) => {
  const db = readDB();
  const reel = (db.reels || []).find(r => r.id === req.params.id);
  if (!reel) {
    return res.status(404).json({ error: 'Reel not found.' });
  }
  res.json(reel);
});

// Admin / Public: Add new video reel drop
router.post('/', (req, res) => {
  const { title, videoUrl, coverImage, productId, productName, productPrice, tags } = req.body;
  
  if (!title || !videoUrl) {
    return res.status(400).json({ error: 'Title and Video URL are required.' });
  }

  const db = readDB();
  if (!db.reels) db.reels = [];

  // Link product details if productId is supplied
  let linkedName = productName;
  let linkedPrice = productPrice;
  if (productId && (!linkedName || !linkedPrice)) {
    const matchedProd = (db.products || []).find(p => p.id === productId);
    if (matchedProd) {
      linkedName = matchedProd.name;
      linkedPrice = matchedProd.price;
    }
  }

  const newReel = {
    id: `reel-${Date.now()}`,
    title,
    videoUrl,
    coverImage: coverImage || 'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80',
    views: '1.2K',
    likes: '120',
    productId: productId || null,
    productName: linkedName || 'Pure Mulmul Kurti',
    productPrice: linkedPrice || 1299,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['#NailmoresCouture']),
    createdAt: new Date().toISOString()
  };

  db.reels.unshift(newReel);
  writeDB(db);

  res.status(201).json({
    message: 'Video reel drop published successfully.',
    reel: newReel
  });
});

// Admin / Public: Delete video reel
router.delete('/:id', (req, res) => {
  const db = readDB();
  if (!db.reels) db.reels = [];

  const initialCount = db.reels.length;
  db.reels = db.reels.filter(r => r.id !== req.params.id);

  if (db.reels.length === initialCount) {
    return res.status(404).json({ error: 'Reel not found.' });
  }

  writeDB(db);
  res.json({ message: 'Video reel deleted successfully.' });
});

// Public: Like a reel
router.post('/:id/like', (req, res) => {
  const db = readDB();
  if (!db.reels) db.reels = [];

  const reel = db.reels.find(r => r.id === req.params.id);
  if (!reel) {
    return res.status(404).json({ error: 'Reel not found.' });
  }

  // Parse and increment likes
  let num = parseInt(reel.likes.replace(/[^0-9]/g, '')) || 0;
  num += 1;
  reel.likes = `${num}`;
  writeDB(db);

  res.json({ success: true, likes: reel.likes });
});

export default router;

