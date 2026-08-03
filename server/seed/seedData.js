import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Models
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import { Inventory, StockHistory } from '../models/Inventory.js';
import DeliveryPartner from '../models/DeliveryPartner.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import Address from '../models/Address.js';
import Review from '../models/Review.js';

const d = (n) => new Date(Date.now() - n * 864e5);
const h = (n) => new Date(Date.now() - n * 36e5);
const hours = h;
const mins = (m) => new Date(Date.now() - m * 6e4);
const daysFuture = (n) => new Date(Date.now() + n * 864e5);

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected\n');

  // Clear all collections
  console.log('🗑️  Clearing collections...');
  await Promise.all([
    User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({}),
    Order.deleteMany({}), Coupon.deleteMany({}), Inventory.deleteMany({}),
    StockHistory.deleteMany({}), DeliveryPartner.deleteMany({}),
    Notification.deleteMany({}), ActivityLog.deleteMany({}),
    Address.deleteMany({}), Review.deleteMany({}),
  ]);
  console.log('✓ Cleared\n');

  // ===== USERS =====
  console.log('👤 Seeding users...');
  const hash = await bcrypt.hash('demo123', 12);

  const users = [
    { _id: 'adm_001', name: 'Ramesh Anandhan', email: 'admin@drstores.com', phone: '+91 98765 43210', password: hash, role: 'admin', tag: 'premium' },
    { _id: 'cus_001', name: 'Priya Sharma', email: 'priya.sharma@gmail.com', phone: '+91 98400 12345', password: hash, role: 'customer', tag: 'vip', notes: ['Loves organic vegetables', 'Prefers morning delivery slots'] },
    { _id: 'cus_002', name: 'Arjun Mehta', email: 'arjun.mehta@outlook.com', phone: '+91 98840 99881', password: hash, role: 'customer', tag: 'premium', notes: ['Frequent exotic vegetable buyer'] },
    { _id: 'cus_003', name: 'Sneha Rao', email: 'sneha.rao@yahoo.com', phone: '+91 99001 22334', password: hash, role: 'customer', tag: 'regular' },
    { _id: 'cus_004', name: 'Karthik Nair', email: 'karthik.nair@gmail.com', phone: '+91 94440 55667', password: hash, role: 'customer', tag: 'regular', notes: ['Prefers UPI payments only'] },
    { _id: 'cus_005', name: 'Divya Krishnan', email: 'divya.krishnan@gmail.com', phone: '+91 98420 77889', password: hash, role: 'customer', tag: 'vip', notes: ['Birthday discount applied annually', 'Loves fresh herbs'] },
    { _id: 'cus_006', name: 'Mohammed Irfan', email: 'mirfan@gmail.com', phone: '+91 96290 44556', password: hash, role: 'customer', tag: 'new', notes: ['First-time coupon used'] },
    { _id: 'cus_007', name: 'Lakshmi Devi', email: 'lakshmi.devi@gmail.com', phone: '+91 95850 33445', password: hash, role: 'customer', tag: 'premium', notes: ['Prefers phone orders', 'Cash payment preferred'] },
    { _id: 'cus_008', name: 'Rohan Iyer', email: 'rohan.iyer@hotmail.com', phone: '+91 90030 11223', password: hash, role: 'customer', tag: 'new' },
    { _id: 'cus_009', name: 'Meera Nandini', email: 'meera.n@gmail.com', phone: '+91 97890 66554', password: hash, role: 'customer', tag: 'regular', notes: ['Vegetarian only', 'Prefers evening delivery'] },
    { _id: 'cus_010', name: 'Suresh Kumar', email: 'suresh.k@gmail.com', phone: '+91 99940 88990', password: hash, role: 'customer', tag: 'regular', blocked: true, notes: ['Blocked due to repeated returns'] },
    { _id: 'cus_011', name: 'Anita Verma', email: 'anita.verma@gmail.com', phone: '+91 98650 22331', password: hash, role: 'customer', tag: 'premium', notes: ['Exotic vegetables enthusiast'] },
    { _id: 'cus_012', name: 'Vignesh Raja', email: 'vignesh.r@gmail.com', phone: '+91 95000 44556', password: hash, role: 'customer', tag: 'new', notes: ['Requested raw banana availability notification'] },
    { _id: 'demo_001', name: 'Demo Customer', email: 'demo@drstores.com', phone: '+91 9876543210', password: hash, role: 'customer', tag: 'new', notes: ['Demo account shown on the login screen'] },
  ];
  await User.insertMany(users);
  console.log(`✓ ${users.length} users seeded`);

  // ===== CATEGORIES =====
  console.log('📁 Seeding categories...');
  const categories = [
    { _id: 'cat_leafy', name: 'Leafy & Flowering', slug: 'leafy-flowering', icon: '🥬', color: '#2E7D32', order: 1, visible: true, productCount: 6 },
    { _id: 'cat_root', name: 'Root Vegetables', slug: 'root-vegetables', icon: '🥕', color: '#FF9800', order: 2, visible: true, productCount: 5 },
    { _id: 'cat_fruit_veg', name: 'Fruit Vegetables', slug: 'fruit-vegetables', icon: '🍅', color: '#EF4444', order: 3, visible: true, productCount: 5 },
    { _id: 'cat_gourd', name: 'Gourds & Melons', slug: 'gourds-melons', icon: '🥒', color: '#4CAF50', order: 4, visible: true, productCount: 4 },
    { _id: 'cat_essentials', name: 'Cooking Essentials', slug: 'cooking-essentials', icon: '🧄', color: '#8D6E63', order: 5, visible: true, productCount: 4 },
    { _id: 'cat_spice', name: 'Herbs & Spices', slug: 'herbs-spices', icon: '🌿', color: '#1B5E20', order: 6, visible: true, productCount: 5 },
    { _id: 'cat_exotic', name: 'Exotics & Specials', slug: 'exotics-specials', icon: '🍄', color: '#6D4C41', order: 7, visible: true, productCount: 3 },
    { _id: 'cat_daily', name: 'Daily Grocery', slug: 'daily-grocery', icon: '🍚', color: '#FFB74D', order: 8, visible: true, productCount: 3 },
  ];
  await Category.insertMany(categories);
  console.log(`✓ ${categories.length} categories seeded`);

  // ===== PRODUCTS =====
  console.log('📦 Seeding products...');
  const catNameMap = {};
  categories.forEach((c) => { catNameMap[c._id] = c.name; });

  const products = [
    { _id: 'tomato', name: 'Fresh Tomato', slug: 'fresh-tomato', emoji: '🍅', gradient: ['#FF6B6B', '#EE5A24'], category: 'cat_fruit_veg', description: 'Vine-ripened, juicy tomatoes sourced fresh from local farms.', longDescription: 'Hand-picked at peak ripeness from trusted local farms, these tomatoes burst with natural sweetness and vibrant colour.', price: 28, originalPrice: 35, unit: 'kg', stock: 120, minStock: 20, sku: 'DRTOM001', barcode: '8901234567001', status: 'published', organic: true, freshToday: true, bestSeller: true, todaysPick: false, featured: true, badges: ['fresh', 'organic'], weightOptions: ['250g', '500g', '1kg'], tags: ['tomato', 'fresh', 'organic', 'salad', 'curry'], rating: 4.8, reviewCount: 234, nutrition: { calories: 18, protein: '0.9g', carbs: '3.9g', fiber: '1.2g', fat: '0.2g' }, benefits: ['Rich in lycopene', 'Heart health', 'Vitamin C'], origin: 'Kaveri Delta Farms, TN', storage: 'Room temperature. Refrigerate after cutting.', shelfLife: '5-7 days', images: ['tomato'] },
    { _id: 'potato', name: 'Premium Potato', slug: 'premium-potato', emoji: '🥔', gradient: ['#C9A227', '#8D6E63'], category: 'cat_root', description: 'Firm, starchy potatoes ideal for curries and everyday cooking.', longDescription: 'High-quality potatoes with a creamy texture and earthy flavour.', price: 22, originalPrice: 28, unit: 'kg', stock: 200, minStock: 30, sku: 'DRPOT002', barcode: '8901234567002', status: 'published', organic: false, freshToday: true, bestSeller: true, badges: ['fresh'], weightOptions: ['500g', '1kg', '2kg'], tags: ['potato', 'aloo', 'fries', 'curry'], rating: 4.6, reviewCount: 312, nutrition: { calories: 77, protein: '2g', carbs: '17g', fiber: '2.2g', fat: '0.1g' }, benefits: ['Energy source', 'Potassium', 'Gluten-free'], origin: 'Ooty Hill Farms, TN', storage: 'Cool, dark place', shelfLife: '10-14 days', images: ['potato'] },
    { _id: 'onion', name: 'Red Onion', slug: 'red-onion', emoji: '🧅', gradient: ['#B5651D', '#7B3F00'], category: 'cat_root', description: 'Pungent, layered red onions — the backbone of every Indian kitchen.', longDescription: 'Sharp, aromatic red onions that form the base of countless dishes.', price: 18, originalPrice: 24, unit: 'kg', stock: 180, minStock: 25, sku: 'DRONI003', barcode: '8901234567003', status: 'published', badges: ['fresh'], weightOptions: ['250g', '500g', '1kg'], tags: ['onion', 'pyaaz', 'red', 'cooking'], rating: 4.5, reviewCount: 198, nutrition: { calories: 40, protein: '1.1g', carbs: '9.3g', fiber: '1.7g', fat: '0.1g' }, benefits: ['Antioxidants', 'Anti-inflammatory', 'Heart health'], origin: 'Kumbakonam Mandi, TN', storage: 'Cool, dry place', shelfLife: '14-21 days', images: ['onion'] },
    { _id: 'carrot', name: 'Sweet Carrot', slug: 'sweet-carrot', emoji: '🥕', gradient: ['#FF9800', '#E65100'], category: 'cat_root', description: 'Sweet, crunchy carrots perfect for salads and cooking.', longDescription: 'Vibrant orange carrots with a satisfying crunch and natural sweetness.', price: 40, originalPrice: 52, unit: 'kg', stock: 64, minStock: 15, sku: 'DRCAR004', barcode: '8901234567004', status: 'published', freshToday: true, todaysPick: true, featured: true, badges: ['fresh'], weightOptions: ['250g', '500g', '1kg'], tags: ['carrot', 'gajar', 'juice', 'halwa'], rating: 4.7, reviewCount: 156, nutrition: { calories: 41, protein: '0.9g', carbs: '9.6g', fiber: '2.8g', fat: '0.2g' }, benefits: ['Vitamin A', 'Eye health', 'Antioxidants'], origin: 'Coorg, Karnataka', storage: 'Refrigerate', shelfLife: '7-10 days', images: ['carrot'] },
    { _id: 'spinach', name: 'Baby Spinach', slug: 'baby-spinach', emoji: '🥬', gradient: ['#4CAF50', '#1B5E20'], category: 'cat_leafy', description: 'Tender baby spinach leaves — iron-rich superfood.', longDescription: 'Delicate, nutrient-dense baby spinach leaves picked at perfect stage.', price: 24, originalPrice: 30, unit: 'bunch', stock: 6, minStock: 15, sku: 'DRSPA005', barcode: '8901234567005', status: 'published', organic: true, freshToday: true, badges: ['fresh', 'organic'], weightOptions: ['250g', '500g'], tags: ['spinach', 'palak', 'leafy', 'iron'], rating: 4.4, reviewCount: 89, nutrition: { calories: 23, protein: '2.9g', carbs: '3.6g', fiber: '2.2g', fat: '0.4g' }, benefits: ['Iron rich', 'Leafy greens', 'Smoothies'], origin: 'Ooty Hill Farms, TN', storage: 'Refrigerate', shelfLife: '3-5 days', images: ['spinach'] },
    { _id: 'beetroot', name: 'Fresh Beetroot', slug: 'fresh-beetroot', emoji: '🫕', gradient: ['#880E4F', '#4A148C'], category: 'cat_root', description: 'Deep red beetroots rich in natural sweetness and iron.', longDescription: 'Richly coloured, naturally sweet beetroots that are a nutritional powerhouse.', price: 32, originalPrice: 40, unit: 'kg', stock: 45, minStock: 12, sku: 'DRBET006', badges: ['fresh', 'organic'], weightOptions: ['250g', '500g', '1kg'], tags: ['beetroot', 'juice', 'salad'], rating: 4.3, reviewCount: 67, nutrition: { calories: 43, protein: '1.6g', carbs: '9.6g', fiber: '2.8g', fat: '0.2g' }, benefits: ['Blood purifier', 'Iron rich', 'Detox'], origin: 'Ooty Hill Farms, TN', storage: 'Refrigerate', shelfLife: '7-10 days', images: ['beetroot'] },
    { _id: 'broccoli', name: 'Fresh Broccoli', slug: 'fresh-broccoli', emoji: '🥦', gradient: ['#388E3C', '#1B5E20'], category: 'cat_exotic', description: 'Premium green broccoli florets, farm-fresh.', longDescription: 'Premium quality broccoli with compact, deep-green florets.', price: 65, originalPrice: 85, unit: 'kg', stock: 9, minStock: 10, sku: 'DRBRC007', freshToday: true, badges: ['fresh'], weightOptions: ['250g', '500g'], tags: ['broccoli', 'exotic', 'superfood'], rating: 4.5, reviewCount: 42, nutrition: { calories: 34, protein: '2.8g', carbs: '7g', fiber: '2.6g', fat: '0.4g' }, benefits: ['Superfood', 'Vitamin C', 'Fibre'], origin: 'Coorg, Karnataka', storage: 'Refrigerate', shelfLife: '4-6 days', images: ['broccoli'] },
    { _id: 'cauliflower', name: 'White Cauliflower', slug: 'white-cauliflower', emoji: '🤍', gradient: ['#F5F5F5', '#E0E0E0'], category: 'cat_fruit_veg', description: 'Fresh, compact cauliflower heads.', longDescription: 'Compact, creamy-white cauliflower with mild, slightly sweet flavour.', price: 35, originalPrice: 45, unit: 'kg', stock: 55, minStock: 12, sku: 'DRCAU008', badges: ['fresh'], weightOptions: ['500g', '1kg'], tags: ['cauliflower', 'gobi', 'manchurian'], rating: 4.2, reviewCount: 98, nutrition: { calories: 25, protein: '1.9g', carbs: '5g', fiber: '2g', fat: '0.3g' }, benefits: ['Low calorie', 'Fibre', 'Vitamin C'], origin: 'Coimbatore, TN', storage: 'Refrigerate', shelfLife: '5-7 days', images: ['cauliflower'] },
    { _id: 'ladies-finger', name: 'Ladies Finger (Okra)', slug: 'ladies-finger-okra', emoji: '🫛', gradient: ['#558B2F', '#33691E'], category: 'cat_fruit_veg', description: 'Tender green okra for curries and stir-fries.', longDescription: 'Young, tender ladies finger with minimal seeds.', price: 32, originalPrice: 42, unit: 'kg', stock: 38, minStock: 10, sku: 'DRLFR009', freshToday: true, badges: ['fresh'], weightOptions: ['250g', '500g'], tags: ['okra', 'bhindi', 'ladies-finger'], rating: 4.3, reviewCount: 76, nutrition: { calories: 33, protein: '1.9g', carbs: '7g', fiber: '3.2g', fat: '0.2g' }, benefits: ['Fibre rich', 'Vitamin K', 'Antioxidants'], origin: 'Tanjore, TN', storage: 'Room temperature', shelfLife: '3-5 days', images: ['ladies-finger'] },
    { _id: 'brinjal', name: 'Purple Brinjal', slug: 'purple-brinjal', emoji: '🍆', gradient: ['#6A1B9A', '#4A148C'], category: 'cat_fruit_veg', description: 'Glossy purple brinjal — great for bharta and curries.', longDescription: 'Firm, glossy brinjals with deep purple skin.', price: 28, originalPrice: 35, unit: 'kg', stock: 42, minStock: 10, sku: 'DRBRJ010', badges: ['fresh'], weightOptions: ['250g', '500g'], tags: ['brinjal', 'eggplant', 'baingan', 'bharta'], rating: 4.2, reviewCount: 65, nutrition: { calories: 25, protein: '1g', carbs: '6g', fiber: '3g', fat: '0.2g' }, benefits: ['Low calorie', 'Brain health', 'Antioxidants'], origin: 'Salem, TN', storage: 'Room temperature', shelfLife: '5-7 days', images: ['brinjal'] },
    { _id: 'cabbage', name: 'Green Cabbage', slug: 'green-cabbage', emoji: '🥬', gradient: ['#81C784', '#4CAF50'], category: 'cat_leafy', description: 'Crisp, fresh cabbage for slaws and stir-fries.', longDescription: 'Fresh, crunchy green cabbage with tightly packed leaves.', price: 20, originalPrice: 28, unit: 'kg', stock: 72, minStock: 15, sku: 'DRCAB011', badges: ['fresh'], weightOptions: ['500g', '1kg'], tags: ['cabbage', 'coleslaw', 'poriyal'], rating: 4.1, reviewCount: 54, nutrition: { calories: 25, protein: '1.3g', carbs: '6g', fiber: '2.5g', fat: '0.1g' }, benefits: ['Vitamin K', 'Gut health', 'Low calorie'], origin: 'Coorg, Karnataka', storage: 'Refrigerate', shelfLife: '7-10 days', images: ['cabbage'] },
    { _id: 'mint', name: 'Fresh Mint', slug: 'fresh-mint', emoji: '🌿', gradient: ['#2E7D32', '#004D40'], category: 'cat_spice', description: 'Fragrant fresh mint leaves for chutneys and drinks.', longDescription: 'Fragrant, vibrant mint leaves that fill the kitchen with cooling aroma.', price: 12, originalPrice: 18, unit: 'bunch', stock: 8, minStock: 20, sku: 'DRMNT012', freshToday: true, badges: ['fresh'], weightOptions: ['100g', '250g'], tags: ['mint', 'pudina', 'chutney', 'herb'], rating: 4.4, reviewCount: 88, nutrition: { calories: 70, protein: '3.3g', carbs: '14.9g', fiber: '8g', fat: '0.9g' }, benefits: ['Digestion', 'Breath freshener', 'Cooling'], origin: 'Madurai, TN', storage: 'Refrigerate', shelfLife: '3-5 days', images: ['mint'] },
    { _id: 'coriander', name: 'Fresh Coriander', slug: 'fresh-coriander', emoji: '🌱', gradient: ['#43A047', '#1B5E20'], category: 'cat_spice', description: 'Fresh coriander leaves — essential garnish for Indian dishes.', longDescription: 'Fresh, aromatic coriander with tender stems.', price: 12, originalPrice: 18, unit: 'bunch', stock: 5, minStock: 20, sku: 'DRCOR013', organic: true, freshToday: true, bestSeller: true, badges: ['fresh', 'organic'], weightOptions: ['100g', '250g'], tags: ['coriander', 'dhania', 'garnish', 'chutney'], rating: 4.3, reviewCount: 132, nutrition: { calories: 23, protein: '2.1g', carbs: '3.7g', fiber: '2.8g', fat: '0.5g' }, benefits: ['Vitamin K', 'Antioxidant', 'Digestive aid'], origin: 'Madurai, TN', storage: 'Refrigerate', shelfLife: '2-4 days', images: ['coriander'] },
    { _id: 'garlic', name: 'Fresh Garlic', slug: 'fresh-garlic', emoji: '🧄', gradient: ['#F5F5F5', '#E0E0E0'], category: 'cat_essentials', description: 'Pungent garlic bulbs — a kitchen essential.', longDescription: 'Firm, plump garlic cloves with powerful, pungent aroma.', price: 35, originalPrice: 48, unit: 'kg', stock: 85, minStock: 15, sku: 'DRGRC014', badges: ['fresh'], weightOptions: ['100g', '250g', '500g'], tags: ['garlic', 'poondu', 'lehsun', 'spice'], rating: 4.5, reviewCount: 178, nutrition: { calories: 149, protein: '6.4g', carbs: '33g', fiber: '2.1g', fat: '0.5g' }, benefits: ['Immunity boost', 'Heart health', 'Antibacterial'], origin: 'Theni, TN', storage: 'Cool, dry place', shelfLife: '21-30 days', images: ['garlic'] },
    { _id: 'ginger', name: 'Fresh Ginger', slug: 'fresh-ginger', emoji: '🫚', gradient: ['#D4A574', '#A1887F'], category: 'cat_essentials', description: 'Aromatic fresh ginger root.', longDescription: 'Plump, golden-skinned ginger with a fiery, warming bite.', price: 30, originalPrice: 40, unit: 'kg', stock: 68, minStock: 12, sku: 'DRGIN015', freshToday: true, badges: ['fresh'], weightOptions: ['100g', '250g'], tags: ['ginger', 'inji', 'adrak', 'chai'], rating: 4.4, reviewCount: 145, nutrition: { calories: 80, protein: '1.8g', carbs: '18g', fiber: '2g', fat: '0.8g' }, benefits: ['Anti-nausea', 'Immunity', 'Anti-inflammatory'], origin: 'Theni, TN', storage: 'Cool, dry place', shelfLife: '14-21 days', images: ['ginger'] },
    { _id: 'pumpkin', name: 'Yellow Pumpkin', slug: 'yellow-pumpkin', emoji: '🎃', gradient: ['#FF9800', '#F57C00'], category: 'cat_gourd', description: 'Sweet, tender yellow pumpkin.', longDescription: 'Rich, golden-fleshed pumpkin with naturally sweet, buttery flavour.', price: 22, originalPrice: 30, unit: 'kg', stock: 40, minStock: 10, sku: 'DRPUM016', badges: ['fresh'], weightOptions: ['500g', '1kg'], tags: ['pumpkin', 'poosanikai', 'sambar'], rating: 4.1, reviewCount: 43, nutrition: { calories: 26, protein: '1g', carbs: '6.5g', fiber: '0.5g', fat: '0.1g' }, benefits: ['Vitamin A', 'Eye health', 'Low calorie'], origin: 'Madurai, TN', storage: 'Room temperature', shelfLife: '7-10 days', images: ['pumpkin'] },
    { _id: 'bottle-gourd', name: 'Bottle Gourd', slug: 'bottle-gourd', emoji: '🥒', gradient: ['#81C784', '#66BB6A'], category: 'cat_gourd', description: 'Smooth, light green bottle gourd.', longDescription: 'Light green, elongated bottle gourd with mild, refreshing flavour.', price: 20, originalPrice: 28, unit: 'kg', stock: 30, minStock: 8, sku: 'DRBTL017', badges: ['fresh'], weightOptions: ['500g', '1kg'], tags: ['bottle-gourd', 'surai', 'lauki'], rating: 4.0, reviewCount: 32, nutrition: { calories: 15, protein: '0.6g', carbs: '3.7g', fiber: '0.5g', fat: '0.1g' }, benefits: ['Hydrating', 'Low calorie', 'Digestive'], origin: 'Salem, TN', storage: 'Room temperature', shelfLife: '5-7 days', images: ['bottle-gourd'] },
    { _id: 'mushroom', name: 'Button Mushroom', slug: 'button-mushroom', emoji: '🍄', gradient: ['#A1887F', '#5D4037'], category: 'cat_exotic', description: 'Premium button mushrooms.', longDescription: 'Firm, unblemished button mushrooms with deep umami flavour.', price: 55, originalPrice: 75, unit: 'kg', stock: 12, minStock: 10, sku: 'DRMUS018', freshToday: true, badges: ['fresh'], weightOptions: ['200g', '500g'], tags: ['mushroom', 'exotic', 'khumbi'], rating: 4.6, reviewCount: 56, nutrition: { calories: 22, protein: '3.1g', carbs: '3.3g', fiber: '1g', fat: '0.3g' }, benefits: ['Low calorie', 'Vitamin D', 'Protein'], origin: 'Ooty Hill Farms, TN', storage: 'Refrigerate', shelfLife: '3-5 days', images: ['mushroom'] },
    { _id: 'corn', name: 'Sweet Corn', slug: 'sweet-corn', emoji: '🌽', gradient: ['#FFC107', '#FF9800'], category: 'cat_daily', description: 'Fresh sweet corn kernels — ready to cook.', longDescription: 'Plump, golden kernels bursting with natural sweetness.', price: 30, originalPrice: 42, unit: 'kg', stock: 55, minStock: 12, sku: 'DRCRN019', freshToday: true, todaysPick: true, badges: ['fresh'], weightOptions: ['250g', '500g'], tags: ['corn', 'sweet', 'bhutta'], rating: 4.5, reviewCount: 98, nutrition: { calories: 86, protein: '3.3g', carbs: '19g', fiber: '2.7g', fat: '1.2g' }, benefits: ['Energy', 'Fibre', 'Eye health'], origin: 'Coimbatore, TN', storage: 'Refrigerate', shelfLife: '3-5 days', images: ['corn'] },
    { _id: 'green-chilli', name: 'Green Chilli', slug: 'green-chilli', emoji: '🌶️', gradient: ['#4CAF50', '#2E7D32'], category: 'cat_essentials', description: 'Fiery green chillies — use with care!', longDescription: 'Compact, intensely hot green chillies.', price: 18, originalPrice: 25, unit: 'kg', stock: 78, minStock: 15, sku: 'DRCHI020', freshToday: true, badges: ['fresh'], weightOptions: ['100g', '250g'], tags: ['chilli', 'mirchi', 'milagai', 'spice'], rating: 4.4, reviewCount: 156, nutrition: { calories: 40, protein: '2g', carbs: '8.8g', fiber: '1.5g', fat: '0.4g' }, benefits: ['Capsaicin', 'Metabolism', 'Vitamin C'], origin: 'Madurai, TN', storage: 'Refrigerate', shelfLife: '5-7 days', images: ['green-chilli'] },
    { _id: 'cucumber', name: 'Fresh Cucumber', slug: 'fresh-cucumber', emoji: '🥒', gradient: ['#66BB6A', '#388E3C'], category: 'cat_gourd', description: 'Cool, crisp cucumber for salads.', longDescription: 'Long, dark-green cucumbers with satisfying crunch.', price: 18, originalPrice: 25, unit: 'kg', stock: 90, minStock: 15, sku: 'DRCUC021', organic: true, freshToday: true, badges: ['fresh', 'organic'], weightOptions: ['250g', '500g', '1kg'], tags: ['cucumber', 'kheera', 'salad', 'raita'], rating: 4.3, reviewCount: 74, nutrition: { calories: 16, protein: '0.7g', carbs: '3.6g', fiber: '0.5g', fat: '0.1g' }, benefits: ['Hydrating', 'Cooling', 'Low calorie'], origin: 'Kaveri Delta, TN', storage: 'Refrigerate', shelfLife: '5-7 days', images: ['cucumber'] },
    { _id: 'peas', name: 'Green Peas', slug: 'green-peas', emoji: '🫛', gradient: ['#4CAF50', '#2E7D32'], category: 'cat_daily', description: 'Fresh green peas — sweet and tender.', longDescription: 'Fresh green peas with satisfying pop and natural sweetness.', price: 35, originalPrice: 48, unit: 'kg', stock: 42, minStock: 10, sku: 'DRPEA022', badges: ['fresh'], weightOptions: ['250g', '500g'], tags: ['peas', 'matar', 'pattani'], rating: 4.4, reviewCount: 67, nutrition: { calories: 81, protein: '5.4g', carbs: '14g', fiber: '5.7g', fat: '0.4g' }, benefits: ['Protein', 'Fibre', 'Antioxidants'], origin: 'Coorg, Karnataka', storage: 'Refrigerate', shelfLife: '4-6 days', images: ['peas'] },
    { _id: 'red-cabbage', name: 'Red Cabbage', slug: 'red-cabbage', emoji: 'Purple', gradient: ['#9C27B0', '#6A1B9A'], category: 'cat_leafy', description: 'Vibrant purple cabbage for salads.', longDescription: 'Stunning, deep-purple cabbage with peppery crunch.', price: 30, originalPrice: 40, unit: 'kg', stock: 18, minStock: 8, sku: 'DRRCB023', badges: ['fresh', 'organic'], weightOptions: ['250g', '500g'], tags: ['red-cabbage', 'purple', 'slaw', 'salad'], rating: 4.1, reviewCount: 34, nutrition: { calories: 31, protein: '1.4g', carbs: '7g', fiber: '2.1g', fat: '0.2g' }, benefits: ['Antioxidants', 'Vitamin C', 'Anti-inflammatory'], origin: 'Coorg, Karnataka', storage: 'Refrigerate', shelfLife: '7-10 days', images: ['red-cabbage'] },
    { _id: 'zucchini', name: 'Green Zucchini', slug: 'green-zucchini', emoji: '🥒', gradient: ['#8BC34A', '#689F38'], category: 'cat_exotic', description: 'Tender green zucchini for versatile cooking.', longDescription: 'Smooth-skinned, bright-green zucchini with mild flavour.', price: 48, originalPrice: 65, unit: 'kg', stock: 22, minStock: 8, sku: 'DRZUC024', freshToday: true, featured: true, badges: ['fresh', 'organic'], weightOptions: ['250g', '500g'], tags: ['zucchini', 'exotic', 'pasta', 'grill'], rating: 4.3, reviewCount: 28, nutrition: { calories: 17, protein: '1.2g', carbs: '3.1g', fiber: '1g', fat: '0.3g' }, benefits: ['Low calorie', 'Potassium', 'Versatile'], origin: 'Coorg, Karnataka', storage: 'Refrigerate', shelfLife: '5-7 days', images: ['zucchini'] },
    { _id: 'lemon', name: 'Fresh Lemon', slug: 'fresh-lemon', emoji: '🍋', gradient: ['#FDD835', '#F9A825'], category: 'cat_daily', description: 'Juicy lemons — perfect for everything.', longDescription: 'Thin-skinned, juicy lemons packed with bright, tangy juice.', price: 6, originalPrice: 10, unit: 'piece', stock: 14, minStock: 20, sku: 'DRLEM025', freshToday: true, bestSeller: true, badges: ['fresh'], weightOptions: ['1 piece', '4 piece', '1 kg'], tags: ['lemon', 'nimbu', 'citrus', 'juice'], rating: 4.6, reviewCount: 245, nutrition: { calories: 29, protein: '1.1g', carbs: '9.3g', fiber: '2.8g', fat: '0.3g' }, benefits: ['Vitamin C', 'Detox', 'Immunity'], origin: 'Erode, TN', storage: 'Room temperature', shelfLife: '10-14 days', images: ['lemon'] },
    { _id: 'drumstick', name: 'Drumstick', slug: 'drumstick', emoji: '🫛', gradient: ['#6D4C41', '#4E342E'], category: 'cat_gourd', description: 'Fresh drumstick pods for sambar and rasam.', longDescription: 'Tender, green drumsticks with unique flavour for sambar.', price: 25, originalPrice: 35, unit: 'kg', stock: 28, minStock: 10, sku: 'DRDRM026', badges: ['fresh'], weightOptions: ['250g', '500g'], tags: ['drumstick', 'murungakkai', 'sambar'], rating: 4.2, reviewCount: 56, nutrition: { calories: 37, protein: '2.1g', carbs: '7g', fiber: '3.2g', fat: '0.1g' }, benefits: ['Iron', 'Calcium', 'Anti-diabetic'], origin: 'Madurai, TN', storage: 'Room temperature', shelfLife: '5-7 days', images: ['drumstick'] },
    { _id: 'sweet-potato', name: 'Sweet Potato', slug: 'sweet-potato', emoji: '🍠', gradient: ['#D84315', '#BF360C'], category: 'cat_root', description: 'Naturally sweet, nutrient-dense sweet potatoes.', longDescription: 'Orange-fleshed sweet potatoes with naturally sweet, creamy texture.', price: 30, originalPrice: 40, unit: 'kg', stock: 35, minStock: 10, sku: 'DRSWT027', badges: ['fresh'], weightOptions: ['250g', '500g', '1kg'], tags: ['sweet-potato', 'shakarkandi'], rating: 4.3, reviewCount: 48, nutrition: { calories: 86, protein: '1.6g', carbs: '20g', fiber: '3g', fat: '0.1g' }, benefits: ['Vitamin A', 'Fibre', 'Natural sweetener'], origin: 'Tirunelveli, TN', storage: 'Cool, dry place', shelfLife: '10-14 days', images: ['sweet-potato'] },
    { _id: 'spring-onion', name: 'Spring Onion', slug: 'spring-onion', emoji: '🧅', gradient: ['#4CAF50', '#2E7D32'], category: 'cat_spice', description: 'Fresh spring onions for garnish and stir-fry.', longDescription: 'Tender spring onions with mild, sweet onion flavour.', price: 15, originalPrice: 22, unit: 'bunch', stock: 40, minStock: 10, sku: 'DRSPO028', status: 'draft', freshToday: true, badges: ['fresh'], weightOptions: ['100g', '250g'], tags: ['spring-onion', 'noodles', 'garnish'], rating: 4.0, reviewCount: 22, nutrition: { calories: 32, protein: '1.8g', carbs: '7.3g', fiber: '2.6g', fat: '0.2g' }, benefits: ['Vitamin K', 'Fresh garnish', 'Flavour'], origin: 'Ooty Hill Farms, TN', storage: 'Refrigerate', shelfLife: '5-7 days', images: ['spring-onion'] },
    { _id: 'curry-leaves', name: 'Curry Leaves', slug: 'curry-leaves', emoji: '🌿', gradient: ['#1B5E20', '#004D40'], category: 'cat_spice', description: 'Fresh curry leaves — aromatic essential.', longDescription: 'Fresh, intensely aromatic curry leaves still on their stems.', price: 8, originalPrice: 12, unit: 'bunch', stock: 50, minStock: 20, sku: 'DRCRV039', organic: true, freshToday: true, bestSeller: true, badges: ['fresh', 'organic'], weightOptions: ['50g', '100g'], tags: ['curry-leaves', 'karuveppilai', 'tempering'], rating: 4.7, reviewCount: 189, nutrition: { calories: 108, protein: '6g', carbs: '18g', fiber: '6.4g', fat: '1g' }, benefits: ['Iron rich', 'Hair health', 'Digestive'], origin: 'Madurai, TN', storage: 'Room temperature', shelfLife: '3-5 days', images: ['curry-leaves'] },
    { _id: 'fenugreek', name: 'Fenugreek Leaves', slug: 'fenugreek-leaves', emoji: '🌿', gradient: ['#558B2F', '#1B5E20'], category: 'cat_spice', description: 'Fresh methi leaves — aromatic and flavourful.', longDescription: 'Fresh fenugreek leaves with distinctive bitter-sweet aroma.', price: 15, originalPrice: 22, unit: 'bunch', stock: 30, minStock: 10, sku: 'DRFEN033', organic: true, freshToday: true, badges: ['fresh', 'organic'], weightOptions: ['100g', '250g'], tags: ['fenugreek', 'methi', 'thepla'], rating: 4.3, reviewCount: 52, nutrition: { calories: 49, protein: '4.4g', carbs: '6g', fiber: '1.1g', fat: '0.9g' }, benefits: ['Iron rich', 'Diabetic friendly', 'Digestive'], origin: 'Madurai, TN', storage: 'Refrigerate', shelfLife: '2-4 days', images: ['fenugreek'] },
    { _id: 'raw-banana', name: 'Raw Banana', slug: 'raw-banana', emoji: '🍌', gradient: ['#C0CA33', '#9E9D24'], category: 'cat_daily', description: 'Raw cooking bananas for chips and curry.', longDescription: 'Unripe, green bananas with starchy, mildly bitter flavour.', price: 24, originalPrice: 32, unit: 'kg', stock: 3, minStock: 10, sku: 'DRBAN040', badges: ['fresh'], weightOptions: ['500g', '1kg'], tags: ['raw-banana', 'kaya', 'vazhakkai'], rating: 4.1, reviewCount: 44, nutrition: { calories: 89, protein: '1.1g', carbs: '23g', fiber: '2.6g', fat: '0.3g' }, benefits: ['Resistant starch', 'Potassium', 'Energy'], origin: 'Theni, TN', storage: 'Room temperature', shelfLife: '5-7 days', images: ['raw-banana'] },
    { _id: 'beans', name: 'Green Beans', slug: 'green-beans', emoji: '🫛', gradient: ['#43A047', '#2E7D32'], category: 'cat_daily', description: 'Fresh green beans for everyday cooking.', longDescription: 'Crisp, bright-green beans that snap with satisfying crunch.', price: 28, originalPrice: 38, unit: 'kg', stock: 45, minStock: 12, sku: 'DRBN037', freshToday: true, badges: ['fresh', 'organic'], weightOptions: ['250g', '500g'], tags: ['beans', 'green-beans', 'poriyal'], rating: 4.2, reviewCount: 64, nutrition: { calories: 31, protein: '1.8g', carbs: '7g', fiber: '3.4g', fat: '0.1g' }, benefits: ['Fibre', 'Vitamin K', 'Low calorie'], origin: 'Coimbatore, TN', storage: 'Refrigerate', shelfLife: '5-7 days', images: ['beans'] },
    { _id: 'capsicum-green', name: 'Green Capsicum', slug: 'green-capsicum', emoji: '🫑', gradient: ['#4CAF50', '#2E7D32'], category: 'cat_fruit_veg', description: 'Crunchy green capsicum for stir-fry.', longDescription: 'Firm, glossy green capsicums with satisfying crunch.', price: 35, originalPrice: 48, unit: 'kg', stock: 30, minStock: 10, sku: 'DRCAP038', freshToday: true, badges: ['fresh'], weightOptions: ['250g', '500g'], tags: ['capsicum', 'pepper', 'shimla-mirch'], rating: 4.3, reviewCount: 58, nutrition: { calories: 20, protein: '0.9g', carbs: '4.6g', fiber: '1.7g', fat: '0.2g' }, benefits: ['Vitamin C', 'Antioxidants', 'Eye health'], origin: 'Ooty Hill Farms, TN', storage: 'Refrigerate', shelfLife: '5-7 days', images: ['capsicum-green'] },
    { _id: 'ash-gourd', name: 'Ash Gourd', slug: 'ash-gourd', emoji: '🥒', gradient: ['#B0BEC5', '#78909C'], category: 'cat_gourd', description: 'Cooling ash gourd for pachadi and kootu.', longDescription: 'Large, pale ash gourd with neutral flavour.', price: 18, originalPrice: 25, unit: 'kg', stock: 22, minStock: 8, sku: 'DRASH034', badges: ['fresh'], weightOptions: ['500g', '1kg'], tags: ['ash-gourd', 'poosanikai', 'ayurvedic'], rating: 4.0, reviewCount: 20, nutrition: { calories: 13, protein: '0.4g', carbs: '3g', fiber: '0.5g', fat: '0.1g' }, benefits: ['Cooling', 'Low calorie', 'Hydrating'], origin: 'Salem, TN', storage: 'Room temperature', shelfLife: '7-10 days', images: ['ash-gourd'] },
    { _id: 'bitter-gourd', name: 'Bitter Gourd', slug: 'bitter-gourd', emoji: '🥒', gradient: ['#558B2F', '#33691E'], category: 'cat_fruit_veg', description: 'Bitter gourd for the health-conscious.', longDescription: 'Warty-skinned bitter gourd with distinctive sharp, bitter flavour.', price: 25, originalPrice: 35, unit: 'kg', stock: 20, minStock: 8, sku: 'DRBIT035', freshToday: true, badges: ['fresh'], weightOptions: ['250g', '500g'], tags: ['bitter-gourd', 'pavakkai', 'karela'], rating: 3.9, reviewCount: 38, nutrition: { calories: 17, protein: '1g', carbs: '3.7g', fiber: '2.8g', fat: '0.2g' }, benefits: ['Blood sugar control', 'Detox', 'Liver health'], origin: 'Tanjore, TN', storage: 'Refrigerate', shelfLife: '3-5 days', images: ['bitter-gourd'] },
    { _id: 'radish', name: 'White Radish', slug: 'white-radish', emoji: '🥬', gradient: ['#F5F5F5', '#E0E0E0'], category: 'cat_root', description: 'Crisp white radish for salads and cooking.', longDescription: 'Long, white radishes with sharp, peppery bite.', price: 15, originalPrice: 22, unit: 'kg', stock: 32, minStock: 10, sku: 'DRRAD036', badges: ['fresh'], weightOptions: ['250g', '500g'], tags: ['radish', 'mooli', 'paratha'], rating: 4.0, reviewCount: 28, nutrition: { calories: 16, protein: '0.6g', carbs: '3.4g', fiber: '1.6g', fat: '0.1g' }, benefits: ['Digestion', 'Detox', 'Low calorie'], origin: 'Coimbatore, TN', storage: 'Refrigerate', shelfLife: '7-10 days', images: ['radish'] },
  ];

  // Add categoryName to each product
  products.forEach((p) => { p.categoryName = catNameMap[p.category] || 'Uncategorized'; });
  await Product.insertMany(products);
  console.log(`✓ ${products.length} products seeded`);

  // ===== COUPONS =====
  console.log('🎟️  Seeding coupons...');
  const coupons = [
    { _id: 'cpn_001', code: 'WELCOME50', type: 'flat', value: 50, minOrder: 150, usageLimit: 500, usedCount: 312, expiry: daysFuture(30), active: true, description: 'Flat ₹50 off on orders above ₹150', target: 'all' },
    { _id: 'cpn_002', code: 'FIRSTORDER', type: 'percent', value: 15, maxDiscount: 75, minOrder: 200, usageLimit: 1000, usedCount: 428, expiry: daysFuture(90), active: true, description: '15% off up to ₹75 on first order', target: 'new' },
    { _id: 'cpn_003', code: 'FRESH100', type: 'flat', value: 100, minOrder: 500, usageLimit: 200, usedCount: 178, expiry: daysFuture(7), active: true, description: '₹100 off on orders above ₹500', target: 'all' },
    { _id: 'cpn_004', code: 'SAVE20', type: 'percent', value: 20, maxDiscount: 100, minOrder: 300, usageLimit: 300, usedCount: 145, expiry: daysFuture(45), active: true, description: '20% off up to ₹100', target: 'vip' },
    { _id: 'cpn_005', code: 'DR10', type: 'flat', value: 10, minOrder: 0, usageLimit: 10000, usedCount: 8734, expiry: daysFuture(180), active: true, description: '₹10 off — no minimum order', target: 'all' },
    { _id: 'cpn_006', code: 'SUMMER25', type: 'percent', value: 25, maxDiscount: 150, minOrder: 400, usageLimit: 150, usedCount: 150, expiry: d(-5), active: false, description: '25% off up to ₹150 — Summer special', target: 'all' },
    { _id: 'cpn_007', code: 'VIP200', type: 'flat', value: 200, minOrder: 1000, usageLimit: 50, usedCount: 18, expiry: daysFuture(60), active: true, description: 'Flat ₹200 off for VIP members on orders above ₹1000', target: 'vip' },
    { _id: 'cpn_008', code: 'MONSOON15', type: 'percent', value: 15, maxDiscount: 75, minOrder: 250, usageLimit: 500, usedCount: 0, expiry: daysFuture(30), active: false, description: '15% off up to ₹75 — Monsoon offer', target: 'all' },
    { _id: 'cpn_009', code: 'FREESHIP', type: 'flat', value: 30, minOrder: 100, usageLimit: 2000, usedCount: 1204, expiry: daysFuture(120), active: true, description: 'Free delivery (₹30 off) on orders above ₹100', target: 'all' },
    { _id: 'cpn_010', code: 'HARVEST30', type: 'percent', value: 30, maxDiscount: 200, minOrder: 800, usageLimit: 100, usedCount: 67, expiry: daysFuture(14), active: true, description: '30% off up to ₹200 — Harvest festival', target: 'premium' },
  ];
  await Coupon.insertMany(coupons);
  console.log(`✓ ${coupons.length} coupons seeded`);

  // ===== DELIVERY PARTNERS =====
  console.log('🚚 Seeding delivery partners...');
  const deliveryPartners = [
    { _id: 'dp_001', name: 'Ravi Kumar', phone: '+91 98840 11223', email: 'ravi.kumar@drstores.com', vehicle: 'Hero Splendor · TN01 AB 4521', vehicleType: 'Motorcycle', rating: 4.8, totalDeliveries: 1284, successfulDeliveries: 1261, cancelledDeliveries: 23, avgDeliveryTime: 34, onTimePercentage: 94, status: 'online', zone: 'Anna Nagar / T. Nagar', shift: '8:00 AM – 6:00 PM', documents: { license: true, aadhaar: true, insurance: true }, todayDeliveries: 8, todayEarnings: 960 },
    { _id: 'dp_002', name: 'Sathish Babu', phone: '+91 98410 33221', email: 'sathish.b@drstores.com', vehicle: 'TVS Jupiter · TN22 CD 8090', vehicleType: 'Scooter', rating: 4.6, totalDeliveries: 987, successfulDeliveries: 970, cancelledDeliveries: 17, avgDeliveryTime: 38, onTimePercentage: 91, status: 'on_delivery', zone: 'Velachery / Adyar', shift: '10:00 AM – 8:00 PM', documents: { license: true, aadhaar: true, insurance: true }, todayDeliveries: 6, todayEarnings: 720 },
    { _id: 'dp_003', name: 'Mohan Raj', phone: '+91 95000 77112', email: 'mohan.r@drstores.com', vehicle: 'Maruti Eeco · TN01 EF 1234', vehicleType: 'Van', rating: 4.9, totalDeliveries: 1543, successfulDeliveries: 1531, cancelledDeliveries: 12, avgDeliveryTime: 42, onTimePercentage: 96, status: 'on_delivery', zone: 'City-wide (bulk orders)', shift: '7:00 AM – 5:00 PM', documents: { license: true, aadhaar: true, insurance: true }, todayDeliveries: 10, todayEarnings: 1400 },
    { _id: 'dp_004', name: 'Arun Prakash', phone: '+91 96290 44556', email: 'arun.p@drstores.com', vehicle: 'Honda Activa · TN07 GH 9087', vehicleType: 'Scooter', rating: 4.5, totalDeliveries: 756, successfulDeliveries: 742, cancelledDeliveries: 14, avgDeliveryTime: 40, onTimePercentage: 89, status: 'offline', zone: 'Porur / Vadapalani', shift: '12:00 PM – 10:00 PM', documents: { license: true, aadhaar: true, insurance: false }, todayDeliveries: 0, todayEarnings: 0 },
    { _id: 'dp_005', name: 'Karthik Raja', phone: '+91 97910 66554', email: 'karthik.r@drstores.com', vehicle: 'Bajaj Pulsar · TN10 JK 3456', vehicleType: 'Motorcycle', rating: 4.7, totalDeliveries: 1102, successfulDeliveries: 1085, cancelledDeliveries: 17, avgDeliveryTime: 32, onTimePercentage: 93, status: 'online', zone: 'T. Nagar / Nungambakkam', shift: '9:00 AM – 7:00 PM', documents: { license: true, aadhaar: true, insurance: true }, todayDeliveries: 5, todayEarnings: 600 },
    { _id: 'dp_006', name: 'Deepak Singh', phone: '+91 94450 88771', email: 'deepak.s@drstores.com', vehicle: 'Honda CB Shine · TN04 LM 7890', vehicleType: 'Motorcycle', rating: 4.3, totalDeliveries: 342, successfulDeliveries: 330, cancelledDeliveries: 12, avgDeliveryTime: 45, onTimePercentage: 85, status: 'offline', zone: 'Guindy / Saidapet', shift: '6:00 PM – 11:00 PM', documents: { license: true, aadhaar: false, insurance: false }, todayDeliveries: 0, todayEarnings: 0 },
    { _id: 'dp_007', name: 'Vikram Patel', phone: '+91 98760 55432', email: 'vikram.p@drstores.com', vehicle: 'TVS Ntorq · TN09 NO 2345', vehicleType: 'Scooter', rating: 4.4, totalDeliveries: 518, successfulDeliveries: 508, cancelledDeliveries: 10, avgDeliveryTime: 36, onTimePercentage: 90, status: 'online', zone: 'Thiruvanmiyur / Sholinganallur', shift: '8:00 AM – 4:00 PM', documents: { license: true, aadhaar: true, insurance: true }, todayDeliveries: 3, todayEarnings: 360 },
  ];
  await DeliveryPartner.insertMany(deliveryPartners);
  console.log(`✓ ${deliveryPartners.length} delivery partners seeded`);

  // ===== ORDERS =====
  console.log('📋 Seeding orders...');
  const orderStatuses = ['pending', 'accepted', 'preparing', 'packed', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'];
  const statusLabels = { pending: 'Order Placed', accepted: 'Order Accepted', preparing: 'Preparing Items', packed: 'Order Packed', out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Order Cancelled', refunded: 'Payment Refunded' };

  const productMap = {};
  products.forEach((p) => { productMap[p._id] = p; });

  function mkItem(pid, qty, weight) {
    const p = productMap[pid];
    if (!p) return null;
    return { productId: p._id, name: p.name, emoji: p.emoji, gradient: p.gradient, weight, qty, price: p.price, mrp: p.originalPrice };
  }

  function mkTimeline(status, createdAt) {
    const steps = ['pending', 'accepted', 'preparing', 'packed', 'out_for_delivery', 'delivered'];
    if (status === 'cancelled' || status === 'refunded') {
      return [
        { status: 'pending', label: 'Order Placed', time: createdAt, actor: 'Customer' },
        { status, label: statusLabels[status], time: new Date(new Date(createdAt).getTime() + 8 * 6e4), actor: 'Store' },
      ];
    }
    const idx = steps.indexOf(status);
    return steps.slice(0, idx + 1).map((s, i) => ({
      status: s, label: statusLabels[s],
      time: new Date(new Date(createdAt).getTime() + i * 10 * 6e4),
      actor: i === 0 ? 'Customer' : 'Store',
    }));
  }

  const custAvatars = { 'cus_001': 'PS', 'cus_002': 'AM', 'cus_003': 'SR', 'cus_004': 'KN', 'cus_005': 'DK', 'cus_006': 'MI', 'cus_007': 'LD', 'cus_008': 'RI', 'cus_009': 'MN', 'cus_010': 'SK', 'cus_011': 'AV', 'cus_012': 'VR' };
  const custPhones = { 'cus_001': '+91 98400 12345', 'cus_002': '+91 98840 99881', 'cus_003': '+91 99001 22334', 'cus_004': '+91 94440 55667', 'cus_005': '+91 98420 77889', 'cus_006': '+91 96290 44556', 'cus_007': '+91 95850 33445', 'cus_008': '+91 90030 11223', 'cus_009': '+91 97890 66554', 'cus_010': '+91 99940 88990', 'cus_011': '+91 98650 22331', 'cus_012': '+91 95000 44556' };

  const ordersData = [
    { _id: 'ORD-8473', cid: 'cus_001', items: [mkItem('tomato', 2, '1kg'), mkItem('potato', 3, '1kg'), mkItem('onion', 2, '1kg'), mkItem('spinach', 1, 'bunch')], status: 'delivered', partner: deliveryPartners[0], createdAt: mins(220) },
    { _id: 'ORD-8472', cid: 'cus_002', items: [mkItem('carrot', 2, '500g'), mkItem('broccoli', 1, '250g'), mkItem('capsicum-green', 3, '250g')], status: 'preparing', createdAt: mins(35) },
    { _id: 'ORD-8471', cid: 'cus_003', items: [mkItem('onion', 1, '1kg'), mkItem('tomato', 2, '1kg'), mkItem('mint', 2, '100g'), mkItem('coriander', 2, '100g'), mkItem('garlic', 1, '250g')], status: 'out_for_delivery', partner: deliveryPartners[2], createdAt: mins(48) },
    { _id: 'ORD-8470', cid: 'cus_004', items: [mkItem('mushroom', 2, '200g')], status: 'pending', createdAt: mins(6) },
    { _id: 'ORD-8469', cid: 'cus_005', items: [mkItem('beetroot', 2, '500g'), mkItem('carrot', 1, '1kg'), mkItem('spinach', 1, 'bunch')], status: 'delivered', partner: deliveryPartners[1], createdAt: hours(3) },
    { _id: 'ORD-8468', cid: 'cus_006', items: [mkItem('broccoli', 1, '250g'), mkItem('zucchini', 2, '250g'), mkItem('mushroom', 1, '200g'), mkItem('corn', 2, '250g')], status: 'refunded', createdAt: hours(5) },
    { _id: 'ORD-8467', cid: 'cus_007', items: [mkItem('lemon', 6, '1 piece'), mkItem('cucumber', 2, '500g'), mkItem('cabbage', 1, '500g')], status: 'delivered', partner: deliveryPartners[0], createdAt: hours(6) },
    { _id: 'ORD-8466', cid: 'cus_008', items: [mkItem('tomato', 1, '1kg'), mkItem('onion', 1, '1kg'), mkItem('ginger', 1, '250g'), mkItem('garlic', 1, '250g')], status: 'accepted', createdAt: mins(14) },
    { _id: 'ORD-8465', cid: 'cus_009', items: [mkItem('sweet-potato', 2, '500g'), mkItem('corn', 1, '250g'), mkItem('peas', 1, '250g')], status: 'packed', createdAt: mins(22) },
    { _id: 'ORD-8464', cid: 'cus_010', items: [mkItem('drumstick', 2, '250g'), mkItem('bitter-gourd', 1, '250g')], status: 'pending', createdAt: mins(30) },
    { _id: 'ORD-8463', cid: 'cus_011', items: [mkItem('broccoli', 2, '250g'), mkItem('mushroom', 1, '200g'), mkItem('carrot', 1, '500g'), mkItem('cabbage', 1, '1kg')], status: 'delivered', partner: deliveryPartners[4], createdAt: hours(8) },
    { _id: 'ORD-8462', cid: 'cus_002', items: [mkItem('spinach', 2, 'bunch'), mkItem('coriander', 2, '100g')], status: 'delivered', partner: deliveryPartners[1], createdAt: hours(11) },
    { _id: 'ORD-8461', cid: 'cus_012', items: [mkItem('raw-banana', 2, '1kg'), mkItem('sweet-potato', 1, '500g'), mkItem('potato', 2, '1kg')], status: 'cancelled', createdAt: hours(14) },
    { _id: 'ORD-8460', cid: 'cus_001', items: [mkItem('lemon', 12, '1 piece'), mkItem('mint', 2, '100g'), mkItem('cucumber', 2, '1kg')], status: 'delivered', partner: deliveryPartners[3], createdAt: d(1) },
    { _id: 'ORD-8459', cid: 'cus_005', items: [mkItem('tomato', 3, '1kg'), mkItem('capsicum-green', 2, '250g'), mkItem('corn', 1, '250g')], status: 'delivered', partner: deliveryPartners[2], createdAt: d(2) },
    { _id: 'ORD-8458', cid: 'cus_007', items: [mkItem('onion', 2, '1kg'), mkItem('potato', 2, '1kg'), mkItem('garlic', 1, '500g')], status: 'delivered', partner: deliveryPartners[0], createdAt: d(3) },
    { _id: 'ORD-8457', cid: 'cus_009', items: [mkItem('mushroom', 1, '200g'), mkItem('ginger', 2, '100g')], status: 'preparing', createdAt: mins(18) },
    { _id: 'ORD-8456', cid: 'cus_004', items: [mkItem('carrot', 1, '500g'), mkItem('beetroot', 1, '500g'), mkItem('cucumber', 1, '500g')], status: 'refunded', createdAt: d(4) },
    { _id: 'ORD-8455', cid: 'cus_011', items: [mkItem('spinach', 2, 'bunch'), mkItem('fenugreek', 1, '100g'), mkItem('curry-leaves', 2, '100g')], status: 'delivered', partner: deliveryPartners[4], createdAt: d(4) },
    { _id: 'ORD-8454', cid: 'cus_003', items: [mkItem('tomato', 2, '1kg'), mkItem('onion', 1, '1kg'), mkItem('green-chilli', 1, '100g')], status: 'cancelled', createdAt: d(5) },
    { _id: 'ORD-8453', cid: 'cus_001', items: [mkItem('broccoli', 1, '250g'), mkItem('mushroom', 1, '200g'), mkItem('lemon', 4, '1 piece')], status: 'delivered', partner: deliveryPartners[1], createdAt: d(6) },
    { _id: 'ORD-8452', cid: 'cus_006', items: [mkItem('potato', 2, '1kg'), mkItem('onion', 2, '1kg'), mkItem('garlic', 1, '250g'), mkItem('tomato', 2, '1kg')], status: 'delivered', partner: deliveryPartners[2], createdAt: d(7) },
  ];

  const orders = ordersData.filter((o) => o.items.some(Boolean)).map((o) => {
    const items = o.items.filter(Boolean);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const deliveryFee = o.status === 'pending' ? 30 : 0;
    const grandTotal = subtotal + deliveryFee + 5;
    return {
      _id: o._id,
      customer: { _id: o.cid, name: users.find((u) => u._id === o.cid)?.name || '', phone: custPhones[o.cid] || '', email: users.find((u) => u._id === o.cid)?.email || '', avatar: custAvatars[o.cid] || '' },
      items, subtotal, grandTotal, discount: 0, deliveryFee, packagingFee: 5, tax: 0,
      payment: { method: 'UPI', status: 'paid', ref: `upi_${Math.random().toString(36).slice(2, 10)}` },
      status: o.status, source: 'Mobile App',
      partner: o.partner || null,
      delivery: { slot: { id: 'morning', label: 'Morning', time: '8:00 AM - 11:00 AM' }, expectedAt: new Date(Date.now() - 30 * 6e4), deliveredAt: o.status === 'delivered' ? o.createdAt : null },
      name: users.find((u) => u._id === o.cid)?.name || '',
      phone: custPhones[o.cid] || '',
      address: { name: users.find((u) => u._id === o.cid)?.name || '', house: '12, Lake View Residency', street: 'MG Road', locality: 'Anna Nagar', city: 'Chennai', pincode: '600040' },
      notes: { admin: [], customer: '', special: '' },
      timeline: mkTimeline(o.status, o.createdAt),
      createdAt: o.createdAt, priority: 'normal',
    };
  });
  await Order.insertMany(orders);
  console.log(`✓ ${orders.length} orders seeded`);

  // ===== INVENTORY =====
  console.log('📊 Seeding inventory...');
  const invItems = products.filter((p) => p.status !== 'archived').map((p, i) => ({
    _id: `INV-${String(i + 1).padStart(3, '0')}`,
    product: p._id, productName: p.name, emoji: p.emoji, gradient: p.gradient, category: p.category,
    sku: p.sku, barcode: p.barcode, currentStock: p.stock, minStock: p.minStock,
    reservedStock: Math.min(Math.floor(p.stock * 0.08), 10),
    incomingStock: i % 3 === 0 ? 0 : 40,
    unit: p.unit, costPrice: Math.round(p.price * 0.65), sellingPrice: p.price,
    lastRestocked: d(Math.floor(Math.random() * 14) + 1), expiry: d(14),
    status: p.stock <= 0 ? 'out_of_stock' : p.stock < p.minStock ? 'low' : 'in_stock',
  }));
  await Inventory.insertMany(invItems);
  console.log(`✓ ${invItems.length} inventory items seeded`);

  // ===== NOTIFICATIONS =====
  console.log('🔔 Seeding notifications...');
  const notifications = [
    { _id: 'nfn_001', type: 'order', title: 'New order placed', message: 'Priya Sharma ordered 4 items · ₹687', time: '2m ago', read: false, adminOnly: true },
    { _id: 'nfn_002', type: 'lowstock', title: 'Low stock alert', message: 'Baby Spinach down to 6 units', time: '18m ago', read: false, adminOnly: true },
    { _id: 'nfn_003', type: 'coupon', title: 'Coupon expiring', message: 'WELCOME50 expires in 2 days', time: '1h ago', read: false, adminOnly: true },
    { _id: 'nfn_004', type: 'customer', title: 'New customer', message: 'Sneha Rao created an account', time: '2h ago', read: true, adminOnly: true },
    { _id: 'nfn_005', type: 'order', title: 'Order delivered', message: 'ORD-8473 delivered on time', time: '3h ago', read: true, adminOnly: true },
  ];
  await Notification.insertMany(notifications);
  console.log(`✓ ${notifications.length} notifications seeded`);

  // ===== ACTIVITY LOGS =====
  console.log('📝 Seeding activity logs...');
  const activityLogs = [
    { _id: 'log_001', type: 'order', actor: 'System', action: 'New order received', detail: 'ORD-8473 from Priya Sharma · ₹687', timestamp: mins(2), severity: 'info' },
    { _id: 'log_002', type: 'order', actor: 'Ramesh Anandhan', action: 'Order accepted', detail: 'ORD-8472 accepted', timestamp: mins(8), severity: 'success' },
    { _id: 'log_003', type: 'inventory', actor: 'System', action: 'Low stock alert', detail: 'Baby Spinach dropped to 6 units', timestamp: mins(15), severity: 'warning' },
    { _id: 'log_004', type: 'login', actor: 'Ramesh Anandhan', action: 'Admin logged in', detail: 'From 103.21.58.12', timestamp: mins(25), severity: 'info' },
    { _id: 'log_005', type: 'delivery', actor: 'System', action: 'Delivery partner assigned', detail: 'Ravi Kumar assigned to ORD-8471', timestamp: mins(32), severity: 'info' },
    { _id: 'log_006', type: 'coupon', actor: 'Ramesh Anandhan', action: 'Coupon enabled', detail: 'HARVEST30 coupon activated', timestamp: mins(45), severity: 'success' },
    { _id: 'log_007', type: 'product', actor: 'Ramesh Anandhan', action: 'Product updated', detail: 'Sweet Carrot price changed ₹38 → ₹40', timestamp: h(2), severity: 'info' },
    { _id: 'log_008', type: 'customer', actor: 'System', action: 'New customer registered', detail: 'Vignesh Raja (vignesh.r@gmail.com)', timestamp: h(3), severity: 'info' },
    { _id: 'log_009', type: 'order', actor: 'System', action: 'Order delivered', detail: 'ORD-8473 delivered by Ravi Kumar', timestamp: h(3), severity: 'success' },
    { _id: 'log_010', type: 'inventory', actor: 'Ramesh Anandhan', action: 'Stock restocked', detail: 'Fresh Coriander +30 units', timestamp: h(4), severity: 'success' },
  ];
  await ActivityLog.insertMany(activityLogs);
  console.log(`✓ ${activityLogs.length} activity logs seeded`);

  // ===== ADDRESSES =====
  console.log('🏠 Seeding addresses...');
  const addresses = [
    { _id: 'addr_001', user: 'cus_001', label: 'Home', name: 'Priya Sharma', house: '12, Lake View Residency', street: 'MG Road', locality: 'Anna Nagar', city: 'Chennai', pincode: '600040', landmark: 'Near Anna Arch', isDefault: true },
    { _id: 'addr_002', user: 'cus_001', label: 'Office', name: 'Priya Sharma', house: '5B, Tech Park Tower', street: 'Tidel Park Road', locality: 'Taramani', city: 'Chennai', pincode: '600113', isDefault: false },
    { _id: 'addr_003', user: 'cus_002', label: 'Home', name: 'Arjun Mehta', house: '42, Sunrise Apartments', street: 'Greams Road', locality: 'Nungambakkam', city: 'Chennai', pincode: '600006', isDefault: true },
    { _id: 'addr_004', user: 'cus_003', label: 'Home', name: 'Sneha Rao', house: '8, Green Villa', street: 'Velachery Main Road', locality: 'Velachery', city: 'Chennai', pincode: '600042', isDefault: true },
    { _id: 'addr_005', user: 'cus_005', label: 'Home', name: 'Divya Krishnan', house: '23, Palm Grove', street: 'Alwarpet Main Road', locality: 'Alwarpet', city: 'Chennai', pincode: '600018', isDefault: true },
  ];
  await Address.insertMany(addresses);
  console.log(`✓ ${addresses.length} addresses seeded`);

  // ===== REVIEWS =====
  console.log('⭐ Seeding reviews...');
  const reviews = [
    { _id: 'rev_001', user: 'cus_001', product: 'tomato', rating: 5, comment: 'Fresh and juicy tomatoes! Great quality.' },
    { _id: 'rev_002', user: 'cus_002', product: 'broccoli', rating: 5, comment: 'Best broccoli I have found online. Very fresh.' },
    { _id: 'rev_003', user: 'cus_005', product: 'spinach', rating: 4, comment: 'Good quality, a few leaves were wilted.' },
    { _id: 'rev_004', user: 'cus_007', product: 'lemon', rating: 5, comment: 'Juicy and perfect for cooking.' },
    { _id: 'rev_005', user: 'cus_009', product: 'corn', rating: 5, comment: 'Sweet and tender, exactly as described.' },
    { _id: 'rev_006', user: 'cus_011', product: 'mushroom', rating: 4, comment: 'Good quality, slightly small but fresh.' },
    { _id: 'rev_007', user: 'cus_003', product: 'curry-leaves', rating: 5, comment: 'Very aromatic, perfect for tempering.' },
    { _id: 'rev_008', user: 'cus_001', product: 'potato', rating: 4, comment: 'Good starchy potatoes, great for curry.' },
    { _id: 'rev_009', user: 'cus_004', product: 'carrot', rating: 5, comment: 'Sweet and crunchy, excellent quality!' },
    { _id: 'rev_010', user: 'cus_005', product: 'coriander', rating: 4, comment: 'Fresh and flavourful.' },
  ];
  await Review.insertMany(reviews);
  console.log(`✓ ${reviews.length} reviews seeded`);

  console.log('\n🎉 Seed complete!');
  console.log('─'.repeat(40));
  console.log('Admin login: admin@drstores.com / demo123');
  console.log('Customer login: priya.sharma@gmail.com / demo123');
  console.log('─'.repeat(40));

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
