import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readDB, writeDB } from '../../config/database.js';
import { requireAuth, requireAdmin } from '../../core/authMiddleware.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'nailmores_jwt_secret_key_2026';

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const db = readDB();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: 'user',
    phone: phone || '',
    address: address || '',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { passwordHash: _, ...userSafe } = newUser;
  res.status(201).json({ message: 'Registration successful', token, user: userSafe });
});

// Login (Works for both regular Users and Admin)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { passwordHash: _, ...userSafe } = user;
  res.json({ message: 'Login successful', token, user: userSafe });
});

// Get Current User Profile (Protected)
router.get('/profile', requireAuth, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const userOrders = db.orders.filter(o => o.userId === user.id);
  const { passwordHash: _, ...userSafe } = user;
  res.json({ user: userSafe, totalOrders: userOrders.length });
});

// Update Profile Details (Protected)
router.put('/profile', requireAuth, (req, res) => {
  const { name, phone, address } = req.body;
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (name) db.users[userIndex].name = name;
  if (phone !== undefined) db.users[userIndex].phone = phone;
  if (address !== undefined) db.users[userIndex].address = address;

  writeDB(db);
  const { passwordHash: _, ...userSafe } = db.users[userIndex];
  res.json({ message: 'Profile updated successfully', user: userSafe });
});

// Admin: Get all registered customers
router.get('/users', requireAdmin, (req, res) => {
  const db = readDB();
  const customers = db.users.map(({ passwordHash, ...safe }) => {
    const ordersCount = db.orders.filter(o => o.userId === safe.id).length;
    return { ...safe, ordersCount };
  });
  res.json({ count: customers.length, users: customers });
});

export default router;

