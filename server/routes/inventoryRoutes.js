import { Router } from 'express';
import { getInventory, restock, bulkRestock, adjustStock, getStockHistory } from '../controllers/inventoryController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.use(protect, adminOnly);
router.get('/', getInventory);
router.get('/history', getStockHistory);
router.put('/:id/restock', restock);
router.put('/:id/adjust', adjustStock);
router.post('/bulk-restock', bulkRestock);

export default router;
