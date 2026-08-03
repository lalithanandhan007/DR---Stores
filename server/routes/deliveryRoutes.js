import { Router } from 'express';
import { getPartners, getPartner, createPartner, updatePartner, toggleOnline, deletePartners } from '../controllers/deliveryController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.use(protect, adminOnly);
router.get('/', getPartners);
router.get('/:id', getPartner);
router.post('/', createPartner);
router.put('/:id', updatePartner);
router.put('/:id/toggle', toggleOnline);
router.post('/delete', deletePartners);

export default router;
