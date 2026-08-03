import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, loginWithOtp, logout, getMe, updateProfile, forgotPassword, verifyOtp, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, login);

router.post('/login-otp', [
  body('identifier').notEmpty().withMessage('Phone or email required'),
], validate, loginWithOtp);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

router.post('/forgot-password', [
  body('identifier').notEmpty().withMessage('Email or phone is required'),
], validate, forgotPassword);

router.post('/verify-otp', [
  body('identifier').notEmpty(),
  body('code').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
], validate, verifyOtp);

router.post('/reset-password', [
  body('identifier').notEmpty(),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, resetPassword);

export default router;
