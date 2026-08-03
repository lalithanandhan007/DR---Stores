import { Router } from 'express';
import { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.post('/validate', protect, validateCoupon);
router.get('/', protect, adminOnly, getCoupons);
router.post('/', protect, adminOnly, createCoupon);
router.put('/:id', protect, adminOnly, updateCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

export default router;
