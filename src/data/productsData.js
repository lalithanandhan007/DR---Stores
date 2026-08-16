/* ====================================================================
   D.R.STORES — Admin Product & Category configuration
   Category definitions and product status helpers.
   Real product data comes from /api/products (MongoDB).
   ==================================================================== */

export const adminCategories = [
  { _id: 'cat_leafy', name: 'Leafy & Flowering', slug: 'leafy-flowering', icon: '🥬', color: '#2E7D32', order: 1, visible: true },
  { _id: 'cat_root', name: 'Root Vegetables', slug: 'root-vegetables', icon: '🥕', color: '#FF9800', order: 2, visible: true },
  { _id: 'cat_fruit_veg', name: 'Fruit Vegetables', slug: 'fruit-vegetables', icon: '🍅', color: '#EF4444', order: 3, visible: true },
  { _id: 'cat_gourd', name: 'Gourds & Melons', slug: 'gourds-melons', icon: '🥒', color: '#4CAF50', order: 4, visible: true },
  { _id: 'cat_essentials', name: 'Cooking Essentials', slug: 'cooking-essentials', icon: '🧄', color: '#8D6E63', order: 5, visible: true },
  { _id: 'cat_spice', name: 'Herbs & Spices', slug: 'herbs-spices', icon: '🌿', color: '#1B5E20', order: 6, visible: true },
  { _id: 'cat_exotic', name: 'Exotics & Specials', slug: 'exotics-specials', icon: '🍄', color: '#6D4C41', order: 7, visible: true },
  { _id: 'cat_daily', name: 'Daily Grocery', slug: 'daily-grocery', icon: '🍚', color: '#FFB74D', order: 8, visible: true },
]

export const productStatuses = [
  { value: 'published', label: 'Published', color: 'emerald' },
  { value: 'draft', label: 'Draft', color: 'amber' },
  { value: 'archived', label: 'Archived', color: 'gray' },
  { value: 'hidden', label: 'Hidden', color: 'red' },
]