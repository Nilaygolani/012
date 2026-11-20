import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, '../../../data/db.json');

// Strictly focused on Women's Kurtis, Kurti Sets & Upper/Bottom wear (No Sarees)
const initialData = {
  users: [
    {
      id: 'usr-admin-01',
      name: 'Nailmores Admin',
      email: 'admin@nailmores.com',
      passwordHash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      phone: '+91 98765 00000',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-demo-01',
      name: 'Ritu Sharma',
      email: 'ritu@example.com',
      passwordHash: bcrypt.hashSync('user123', 10),
      role: 'user',
      phone: '+91 98765 43210',
      address: 'Flat 402, Royal Palms, Jaipur, Rajasthan 302020',
      createdAt: new Date().toISOString()
    }
  ],
  products: [
    {
      id: 'prod-001',
      name: 'Gulzar Floral Handblock Short Kurti',
      category: 'Short Kurtis',
      badge: 'Bestseller',
      price: 1299,
      originalPrice: 1899,
      stock: 45,
      rating: 4.9,
      inStock: true,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      outOfStockSizes: ['XL'],
      fabric: '100% Breathable Jaipur Mulmul Cotton',
      craft: 'Handblock Wooden Printing',
      description: 'An everyday chic short kurti with delicate square neckline, artisanal floral buti prints, and breathable airy feel. Perfect to pair effortlessly with high-waist jeans or straight trousers.',
      stylingTips: 'Pair with relaxed white linen trousers or slim-fit denim and minimal silver jhumkis for office and college wear.',
      washCare: 'Gentle hand wash in cold water using mild liquid detergent. Dry in shade.',
      image: 'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 'prod-002',
      name: 'Kashish Indigo Corset-Tie Short Kurti',
      category: 'Short Kurtis',
      badge: 'Hot Seller',
      price: 1399,
      originalPrice: 1999,
      stock: 35,
      rating: 4.8,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      fabric: '100% Pure Bagru Dabu Indigo Cotton',
      craft: 'Natural Mud-Resist Dabu Dyeing',
      description: 'Flattering modern silhouette featuring an adjustable tie-up back corset cut, square neckline, and hand-carved botanical prints.',
      stylingTips: 'Tie the back cords to cinch your waist. Pairs exquisitely with straight cotton palazzos or wide-leg jeans.',
      washCare: 'First wash dry clean recommended due to natural indigo. Subsequent cold hand washes.',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 'prod-003',
      name: 'Mehrunisa 3-Piece Kurti Pant & Kota Dupatta Set',
      category: 'Kurti Sets',
      badge: 'Festive Pick',
      price: 2899,
      originalPrice: 3999,
      stock: 28,
      rating: 4.9,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      fabric: 'Slub Cotton Kurti with Zari Kota Doria Dupatta & Straight Trousers',
      craft: 'Gota Patti Borders & Hand-finished Lace',
      description: 'Complete 3-piece festive ensemble featuring a kalidar straight kurti, tapered pants with elasticated waistband, and an ethereal gossamer Kota Doria dupatta with shimmering zari borders.',
      stylingTips: 'Style with antique gold mojaris and statement chandelier earrings for festive gatherings and family occasions.',
      washCare: 'Dry clean preferred for the zari dupatta. Cold gentle wash for kurti & pants.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 'prod-004',
      name: 'Rooh Afza Pastel Pink Long A-Line Kurti',
      category: 'Long Kurtis',
      badge: 'New Arrival',
      price: 1599,
      originalPrice: 2299,
      stock: 40,
      rating: 4.7,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      fabric: 'Fine Khadi Cotton Blend',
      craft: 'Artisanal Wooden Button Placket & Side Slits',
      description: 'Subtle elegance crafted for long workday comfort. Features deep functional pockets on both sides and an elongated A-line flow.',
      stylingTips: 'Wear as a statement tunic with cigarette pants, or accessorize with an oxidized silver choker.',
      washCare: 'Machine wash on gentle cycle with cold water. Warm iron inside out.',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 'prod-005',
      name: 'Chandni Hand-Embroidered Flared Kurti Set',
      category: 'Kurti Sets',
      badge: 'Celebration Drop',
      price: 3299,
      originalPrice: 4799,
      stock: 18,
      rating: 5.0,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      fabric: 'Pure Mulmul Silk with Cotton Lining & Tapered Pants',
      craft: 'Handcrafted Sequin Threadwork & 24-Kali Flare',
      description: 'A regal ivory flared kurti with straight trousers. Accented with subtle metallic thread embroidery along the neckline and sleeves.',
      stylingTips: 'Pair with dewy nude makeup, golden block heels, and pearl drop studs.',
      washCare: 'Dry clean only to maintain embroidery sheen.',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 'prod-006',
      name: 'Zivah Linen Straight-Fit Ethnic Trousers',
      category: 'Ethnic Bottoms',
      badge: 'Everyday Essential',
      price: 999,
      originalPrice: 1499,
      stock: 50,
      rating: 4.8,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      fabric: '100% Breathable Cotton Linen Blend',
      craft: 'Front Belt & Back Elastic with Deep Pockets',
      description: 'Ultra-versatile, structured yet airy trousers designed to complement all your short and long kurtis. Features deep side pockets that actually fit your smartphone.',
      stylingTips: 'The universal bottom wear for all your floral kurtis and casual shirts.',
      washCare: 'Gentle machine wash with like colors.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 'prod-007',
      name: 'Baag-e-Fiza Flared Palazzo Pants',
      category: 'Ethnic Bottoms',
      badge: 'Bestseller',
      price: 1199,
      originalPrice: 1699,
      stock: 32,
      rating: 4.9,
      sizes: ['S', 'M', 'L', 'XL'],
      fabric: 'Pure Cotton Mulmul with Gota Border',
      craft: 'Wide Flared Hem with Golden Gota Detailing',
      description: 'Airy flared palazzo pants that twirl like a skirt while giving you the ease and comfort of pants.',
      stylingTips: 'Pair with our Short Kurtis for a breezy, Bohemian Indo-western fusion.',
      washCare: 'Hand wash in cold water.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 'prod-008',
      name: 'Sahara Handblock Co-ord Kurti & Pants Set',
      category: 'Co-ord Sets',
      badge: 'Trending Duo',
      price: 2199,
      originalPrice: 2999,
      stock: 24,
      rating: 4.8,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      fabric: '100% Pure Sanganeri Cotton',
      craft: 'Matching Top & Bottom Geometric Block Print',
      description: 'Effortless coordinated matching tunic and ankle-length pants. Look instantly styled without spending time matching bottoms.',
      stylingTips: 'Style with chunky loafers or flat juttis and sunglasses for brunch or travel.',
      washCare: 'Gentle wash in cold water.',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80'
      ]
    }
  ],
  orders: [
    {
      orderId: 'NLM-849201',
      userId: 'usr-demo-01',
      customerName: 'Ritu Sharma',
      customerEmail: 'ritu@example.com',
      customerPhone: '+91 98765 43210',
      shippingAddress: 'Flat 402, Royal Palms, Jaipur, Rajasthan 302020',
      items: [
        {
          id: 'prod-001',
          name: 'Gulzar Floral Handblock Short Kurti',
          price: 1299,
          quantity: 1,
          selectedSize: 'M',
          image: 'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80'
        }
      ],
      total: 1299,
      paymentMethod: 'Razorpay Online',
      paymentId: 'pay_demo_849201',
      paymentStatus: 'Paid',
      status: 'Shipped',
      courierPartner: 'BlueDart Express',
      trackingId: 'BD84920199IN',
      trackingUrl: 'https://www.bluedart.com/tracking?track=BD84920199IN',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ],
  reviews: [
    {
      id: 'rev-001',
      productId: 'prod-001',
      productName: 'Gulzar Floral Handblock Short Kurti',
      userId: 'usr-demo-01',
      userName: 'Aishwarya Roy',
      rating: 5,
      comment: 'The cotton fabric is so soft and lightweight. I wore it all day at work in the heat and it kept me so cool. Pairs perfectly with my high-waisted jeans!',
      status: 'approved',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'rev-002',
      productId: 'prod-003',
      productName: 'Mehrunisa 3-Piece Kurti Pant & Kota Dupatta Set',
      userId: 'usr-demo-01',
      userName: 'Pooja Kashyap',
      rating: 5,
      comment: 'The fit of the pants is so comfortable, and the Kota Doria dupatta has such a subtle sheen! Received so many compliments.',
      status: 'approved',
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
    }
  ],
  reels: [
    {
      id: 'reel-001',
      title: 'The 32-Kali Twirl Test: Why Pure Jaipur Mulmul Flows Like Poetry',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-around-in-a-long-dress-39727-large.mp4',
      coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      views: '124.5K',
      likes: '14.2K',
      productId: 'prod-003',
      productName: 'Mehrunisa Flared Anarkali Gown',
      productPrice: 3499,
      tags: ['#AnarkaliTwirl', '#MulmulCotton', '#JaipurCraft'],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'reel-002',
      title: 'Styling Gulzar Floral Short Kurti 3 Ways for Office & College',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-modelling-in-the-street-40294-large.mp4',
      coverImage: 'https://images.unsplash.com/photo-1596783049442-9988b4886616?auto=format&fit=crop&w=800&q=80',
      views: '98.8K',
      likes: '9.6K',
      productId: 'prod-001',
      productName: 'Gulzar Floral Handblock Short Kurti',
      productPrice: 1299,
      tags: ['#ShortKurtiStyling', '#OfficeFit', '#JaipurHandblock'],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'reel-003',
      title: 'From Carved Teakwood Blocks to Finished Kurti: Behind the Loom',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-artisan-weaving-on-a-loom-41808-large.mp4',
      coverImage: 'https://images.meesho.com/images/products/1096061321/162qa_512.avif?width=512',
      views: '145.2K',
      likes: '18.3K',
      productId: 'prod-002',
      productName: 'Kashish Indigo Corset Short Kurti',
      productPrice: 1399,
      tags: ['#KarigarCraft', '#SanganerPrints', '#SlowFashion'],
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      id: 'reel-004',
      title: 'Unboxing the Farshi Suit Set: Mirror Test & Fitting Reaction',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-posing-for-a-fashion-photoshoot-40292-large.mp4',
      coverImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      views: '84.1K',
      likes: '11.1K',
      productId: 'prod-005',
      productName: 'Noor Hand-Embroidered Kurti Set',
      productPrice: 3299,
      tags: ['#Unboxing', '#TryOnHaul', '#NailmoresCouture'],
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'reel-005',
      title: 'Pockets in Ethnic Pants! Testing our Zivah Linen Trousers',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-walking-on-a-beach-at-sunset-1213-large.mp4',
      coverImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
      views: '67.4K',
      likes: '7.8K',
      productId: 'prod-006',
      productName: 'Zivah Linen Straight-Fit Ethnic Trousers',
      productPrice: 999,
      tags: ['#PocketsInKurti', '#LinenPants', '#EverydayComfort'],
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
    }
  ]
};

// Ensure data folder and db.json exist
function ensureDatabase() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } else {
    try {
      const existing = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      let modified = false;
      if (!existing.products || existing.products.length === 0) {
        existing.products = initialData.products;
        modified = true;
      }
      if (!existing.reels || existing.reels.length === 0) {
        existing.reels = initialData.reels;
        modified = true;
      }
      if (modified) {
        fs.writeFileSync(DB_FILE, JSON.stringify(existing, null, 2), 'utf-8');
      }
    } catch (e) {}
  }
}

export function readDB() {
  ensureDatabase();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[DB] Read error:', err);
    return initialData;
  }
}

export function writeDB(data) {
  ensureDatabase();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[DB] Write error:', err);
    return false;
  }
}
