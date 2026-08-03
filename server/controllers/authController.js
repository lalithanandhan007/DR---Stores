import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateToken, setTokenCookie } from '../utils/generateToken.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) throw new ApiError(400, 'Name, email and password are required');

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new ApiError(409, 'An account with this email already exists');

  const id = `usr_${Date.now().toString(36)}`;
  const user = await User.create({ _id: id, name, email: email.toLowerCase(), phone: phone || '', password });
  const token = generateToken(user._id, user.role);
  setTokenCookie(res, token);

  res.status(201).json(ApiResponse.created({ user, token }, 'Account created successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password');
  if (user.blocked) throw new ApiError(403, 'Your account has been blocked. Please contact support.');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  user.lastActiveAt = new Date();
  await user.save({ validateModifiedOnly: true });

  const token = generateToken(user._id, user.role);
  setTokenCookie(res, token);

  res.json(ApiResponse.success({ user, token }, 'Logged in successfully'));
});

export const loginWithOtp = asyncHandler(async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) throw new ApiError(400, 'Phone number or email required');

  const user = await User.findOne({
    $or: [{ phone: identifier }, { email: identifier.toLowerCase() }],
  });
  if (!user) throw new ApiError(404, 'No account found for this number. Please register first.');
  if (user.blocked) throw new ApiError(403, 'Your account has been blocked');

  user.lastActiveAt = new Date();
  await user.save({ validateModifiedOnly: true });

  const token = generateToken(user._id, user.role);
  setTokenCookie(res, token);
  res.json(ApiResponse.success({ user, token }, 'Logged in successfully'));
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, maxAge: 0 });
  res.json(ApiResponse.success(null, 'Logged out'));
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(ApiResponse.success({ user: req.user }));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar, settings } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;
  if (settings) user.settings = { ...user.settings, ...settings };

  await user.save();
  res.json(ApiResponse.success({ user }, 'Profile updated'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) throw new ApiError(400, 'Email or phone number is required');

  const user = await User.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { phone: identifier },
    ],
  });

  // Always return success to prevent enumeration
  if (!user) return res.json(ApiResponse.success(null, 'If an account exists, an OTP has been sent'));

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await user.save({ validateModifiedOnly: true });

  // In production, send OTP via SMS/email. For demo, return it in the response.
  res.json(ApiResponse.success({ otp, identifier }, 'OTP sent successfully'));
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { identifier, code, purpose } = req.body;
  if (!identifier || !code) throw new ApiError(400, 'Identifier and OTP code are required');

  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
  }).select('+otp +otpExpiry');

  if (!user || !user.otp) throw new ApiError(400, 'No OTP requested');
  if (new Date() > user.otpExpiry) throw new ApiError(400, 'OTP expired. Request a new one.');
  if (user.otp !== code) throw new ApiError(400, 'Incorrect OTP');

  // Clear OTP
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save({ validateModifiedOnly: true });

  res.json(ApiResponse.success({ verified: true, purpose, identifier }, 'OTP verified'));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { identifier, newPassword } = req.body;
  if (!identifier || !newPassword) throw new ApiError(400, 'Identifier and new password are required');
  if (newPassword.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');

  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
  }).select('+password');
  if (!user) throw new ApiError(404, 'No account found');

  user.password = newPassword;
  await user.save();

  res.json(ApiResponse.success(null, 'Password reset successfully'));
});
