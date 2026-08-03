import { Router } from 'express';
import { placeOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, assignPartner, addOrderNote, bulkStatus, deleteOrders } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Customer
router.use(protect);
router.post('/', placeOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrder);

// Admin
router.get('/admin/all', adminOnly, getAllOrders);
router.put('/admin/:id/status', adminOnly, updateOrderStatus);
router.put('/admin/:id/partner', adminOnly, assignPartner);
router.put('/admin/:id/notes', adminOnly, addOrderNote);
router.post('/admin/bulk-status', adminOnly, bulkStatus);
router.post('/admin/delete', adminOnly, deleteOrders);

export default router;
