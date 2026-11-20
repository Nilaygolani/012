import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

/**
 * ==============================================================
 * ⭐ RAZORPAY CONFIGURATION FOR NAILMORES (ONLINE PAYMENT ONLY)
 * ==============================================================
 * 
 * To connect your live or test Razorpay account:
 * 1. Open your Razorpay Dashboard (https://dashboard.razorpay.com/)
 * 2. Go to Settings -> API Keys -> Generate Key
 * 3. Put your Key ID & Secret in backend/.env:
 *      RAZORPAY_KEY_ID=rzp_live_... (or rzp_test_...)
 *      RAZORPAY_KEY_SECRET=...
 * ==============================================================
 */

const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_nailmores_demo';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'nailmores_secret_demo';

let razorpayInstance = null;

try {
  if (key_id && key_secret && !key_id.includes('demo')) {
    razorpayInstance = new Razorpay({
      key_id,
      key_secret
    });
    console.log('[Razorpay] Initialized with Key ID:', key_id);
  } else {
    console.log('[Razorpay] Running in Sandbox/Demo mode. Add your real keys in backend/.env to connect to live Razorpay.');
  }
} catch (err) {
  console.warn('[Razorpay] Initialization warning:', err.message);
}

export { razorpayInstance, key_id, key_secret };

