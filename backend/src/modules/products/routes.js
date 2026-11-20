import { Router } from 'express';
import { readDB, writeDB } from '../../config/database.js';
import { requireAdmin } from '../../core/authMiddleware.js';

const router = Router();

// Public: Get all products (with optional filter & search)
router.get('/', (req, res) => {
  const { category, search, sort } = req.query;
  const db = readDB();
  let list = [...db.products];

  if (category && category !== 'all') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.craft && p.craft.toLowerCase().includes(q))
    );
  }

  if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
  if (sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  res.json({ count: list.length, products: list });
});

// Public: Get product by ID
router.get('/:id', (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json(product);
});

// Admin: Add new product
router.post('/', requireAdmin, (req, res) => {
  const { name, category, price, originalPrice, stock, inStock, sizes, outOfStockSizes, fabric, craft, description, image, hoverImage, images, badge } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required.' });
  }

  // Normalize multi-image list
  let imageList = [];
  if (Array.isArray(images)) {
    imageList = images.map(u => String(u || '').trim()).filter(Boolean);
  } else if (typeof images === 'string') {
    imageList = images.split('\n').map(u => u.trim()).filter(Boolean);
  }
  if (image && !imageList.includes(image.trim())) {
    imageList.unshift(image.trim());
  }
  if (hoverImage && !imageList.includes(hoverImage.trim())) {
    imageList.push(hoverImage.trim());
  }

  const primaryImage = imageList[0] || image || 'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=700&q=80';
  const secondaryImage = imageList[1] || hoverImage || primaryImage;

  const db = readDB();
  const isActuallyInStock = inStock !== undefined ? Boolean(inStock) : (stock !== undefined ? Number(stock) > 0 : true);

  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    category,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : Number(price),
    stock: stock !== undefined ? Number(stock) : (isActuallyInStock ? 50 : 0),
    inStock: isActuallyInStock,
    rating: 5.0,
    sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : (category === 'Ethnic Bottoms' ? ['28', '30', '32', '34', '36'] : ['XS', 'S', 'M', 'L', 'XL']),
    outOfStockSizes: Array.isArray(outOfStockSizes) ? outOfStockSizes : [],
    fabric: fabric || '100% Pure Jaipur Cotton',
    craft: craft || 'Handcrafted Artisan Weave',
    description: description || 'Finely tailored contemporary ethnic wear silhouette.',
    stylingTips: req.body.stylingTips || 'Style effortlessly with artisanal footwear and subtle silver jewelry.',
    washCare: req.body.washCare || 'Gentle cold hand wash with mild liquid detergent. Dry in shade.',
    images: imageList.length > 0 ? imageList : [primaryImage, secondaryImage],
    image: primaryImage,
    hoverImage: secondaryImage,
    badge: badge || 'New Arrival'
  };

  db.products.unshift(newProduct);
  writeDB(db);

  res.status(201).json({ message: 'Product created successfully', product: newProduct });
});

// Admin: Edit product
router.put('/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  let imageList = undefined;
  if (req.body.images) {
    if (Array.isArray(req.body.images)) {
      imageList = req.body.images.map(u => String(u || '').trim()).filter(Boolean);
    } else if (typeof req.body.images === 'string') {
      imageList = req.body.images.split('\n').map(u => u.trim()).filter(Boolean);
    }
  }

  const primaryImage = imageList && imageList.length > 0 ? imageList[0] : (req.body.image || db.products[index].image);
  const secondaryImage = imageList && imageList.length > 1 ? imageList[1] : (req.body.hoverImage || db.products[index].hoverImage || primaryImage);

  const updatedInStock = req.body.inStock !== undefined 
    ? Boolean(req.body.inStock) 
    : (req.body.stock !== undefined ? Number(req.body.stock) > 0 : (db.products[index].inStock ?? true));

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    inStock: updatedInStock,
    sizes: Array.isArray(req.body.sizes) ? req.body.sizes : db.products[index].sizes,
    outOfStockSizes: Array.isArray(req.body.outOfStockSizes) ? req.body.outOfStockSizes : (db.products[index].outOfStockSizes || []),
    price: req.body.price !== undefined ? Number(req.body.price) : db.products[index].price,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : db.products[index].stock,
    images: imageList && imageList.length > 0 ? imageList : (db.products[index].images || [primaryImage, secondaryImage]),
    image: primaryImage,
    hoverImage: secondaryImage
  };

  writeDB(db);
  res.json({ message: 'Product updated successfully', product: db.products[index] });
});

// Admin: Delete product
router.delete('/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const initialLength = db.products.length;
  db.products = db.products.filter(p => p.id !== req.params.id);

  if (db.products.length === initialLength) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  writeDB(db);
  res.json({ message: 'Product deleted successfully.' });
});

export default router;

