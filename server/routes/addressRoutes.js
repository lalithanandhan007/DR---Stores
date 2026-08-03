import { Router } from 'express';
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../controllers/addressController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', getAddresses);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.put('/:id/default', setDefaultAddress);

export default router;
