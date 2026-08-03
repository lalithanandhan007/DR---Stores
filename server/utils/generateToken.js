import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const setTokenCookie = (res, token) => {
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
  });
};
