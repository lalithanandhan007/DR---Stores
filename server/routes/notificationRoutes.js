import { Router } from 'express';
import { getNotifications, markRead, markAllRead } from '../controllers/notificationController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', adminOnly, getNotifications);
router.put('/:id/read', adminOnly, markRead);
router.put('/read-all', adminOnly, markAllRead);

export default router;
