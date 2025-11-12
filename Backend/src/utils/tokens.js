import jwt from 'jsonwebtoken';

const ACCESS_TTL = process.env.JWT_EXPIRES_IN || '7d';

export function signAccessToken(user) {
  const id =
    user?.id ??
    (user?._id ? user._id.toString() : undefined);

  if (!id) {
    throw new Error('signAccessToken: user id is missing');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign(
    { id, email: user.email },
    secret,
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
