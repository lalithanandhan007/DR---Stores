import { Router } from 'express';
import { getCustomers, getCustomer, updateCustomer, addCustomerNote, deleteCustomers } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.use(protect, adminOnly);
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomer);
router.put('/customers/:id', updateCustomer);
router.post('/customers/:id/notes', addCustomerNote);
router.post('/customers/delete', deleteCustomers);

export default router;
