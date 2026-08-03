import { Router } from 'express';
import { createRazorpayOrder, verifyPayment, handlePaymentFailure, webhookHandler } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.post('/failure', handlePaymentFailure);
router.post('/webhook', webhookHandler);

export default router;
