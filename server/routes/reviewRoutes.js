import { Router } from 'express';
import { getReviews, createReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/', getReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

export default router;
