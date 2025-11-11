import jwt from 'jsonwebtoken';

const ACCESS_TTL = process.env.JWT_EXPIRES_IN || '7d';

export function signAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TTL }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

/** naive generator for refresh token (opaque) */
export function generateRefreshToken() {
  // Could also use crypto.randomBytes(48).toString('hex')
  return Buffer.from(`${Date.now()}_${Math.random()}`).toString('base64url');
}
