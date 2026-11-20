import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mountDynamicModules } from './src/core/autoRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Server health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'nailmores API Server',
    architecture: 'Plug & Play Fault-Tolerant Micro-Modules',
    panels: ['User Panel', 'Admin Panel'],
    payment: 'Razorpay Online Only (No COD)',
    timestamp: new Date().toISOString()
  });
});

// Auto-mount all plug-and-play backend feature modules
await mountDynamicModules(app);

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🌸 nailmores API Server is running on http://localhost:${PORT}`);
  console.log(`🔒 Razorpay Online Payment Gateway: ACTIVE`);
  console.log(`⚡ Plug & Play Micro-Modules: MOUNTED`);
  console.log(`======================================================\n`);
});

