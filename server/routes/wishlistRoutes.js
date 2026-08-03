import { Router } from 'express';
import { getWishlist, toggleWishlist, removeFromWishlist, clearWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', getWishlist);
router.post('/toggle', toggleWishlist);
router.delete('/:id', removeFromWishlist);
router.delete('/clear/all', clearWishlist);

export default router;
