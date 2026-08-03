import { Router } from 'express';
import { getProducts, getProductsAll, getProduct, createProduct, updateProduct, deleteProduct, getCategories, getAllCategories, createCategory, updateCategory, deleteCategory } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', getProducts);
router.get('/all', protect, adminOnly, getProductsAll);
router.get('/:id', getProduct);

// Admin
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

// Categories
router.get('/categories/all', getAllCategories);
router.get('/categories/list', getCategories);
router.post('/categories', protect, adminOnly, createCategory);
router.put('/categories/:id', protect, adminOnly, updateCategory);
router.delete('/categories/:id', protect, adminOnly, deleteCategory);

export default router;
