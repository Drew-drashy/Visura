import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import Session from '../models/Session.js';
import OAuthAccount from '../models/OAuthAccount.js';
import PasswordReset from '../models/PasswordReset.js';
import { signAccessToken, generateRefreshToken } from '../utils/tokens.js';
import { sendPasswordResetEmail } from '../services/email.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/** Helpers */
async function issueSession(userId, userAgent, ip) {
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + parseDuration(process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'));
  const session = await Session.create({
    userId,
    refreshToken,
    userAgent,
    ip,
    expiresAt
  });
  return session.toObject();
}

function parseDuration(s) {
  // supports Nd, Nh, Nm (days, hours, minutes). e.g., 30d, 12h, 15m
  const m = /^(\d+)([dhm])$/.exec(s);
  if (!m) return 1000 * 60 * 60 * 24 * 30; // default 30d
  const n = Number(m[1]); const u = m[2];
  if (u === 'd') return n * 24 * 60 * 60 * 1000;
  if (u === 'h') return n * 60 * 60 * 1000;
  if (u === 'm') return n * 60 * 1000;
  return 1000 * 60 * 60 * 24 * 30;
}

function respondWithError(res, error, message = 'Internal server error', status = 500) {
  console.error(error);
  if (error?.status && error?.message) {
    return res.status(error.status).json({ error: error.message });
  }
  if (error?.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  return res.status(status).json({ error: message });
}

/** Auth flows */
export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const existing = await User.findOne({ email }).lean();
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const userDoc = await User.create({ email, passwordHash, name });
    const user = userDoc.toObject();

    const accessToken = signAccessToken(user);
    const session = await issueSession(user._id, req.headers['user-agent'] || '', req.ip || '');

    res.json({
      accessToken,
      refreshToken: session.refreshToken,
      user: { id: String(user._id), email: user.email, credits: user.credits, name: user.name }
    });
  } catch (e) { respondWithError(res, e, 'Failed to register user'); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const user = await User.findOne({ email }).lean();
    if (!user || !user.passwordHash) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const accessToken = signAccessToken(user);
    const session = await issueSession(user._id, req.headers['user-agent'] || '', req.ip || '');

    res.json({
      accessToken,
      refreshToken: session.refreshToken,
      user: { id: String(user._id), email: user.email, credits: user.credits, name: user.name }
    });
  } catch (e) { respondWithError(res, e, 'Failed to login'); }
}

export async function googleAuth(req, res, next) {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'idToken required' });

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload(); // { sub, email, name, ... }
    const email = payload.email;
    const googleId = payload.sub;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name: payload.name, googleId });
    } else if (!user.googleId) {
      user = await User.findByIdAndUpdate(user._id, { googleId }, { new: true });
    }
    const userObj = user.toObject ? user.toObject() : user;

    // link OAuthAccount (optional but nice)
    await OAuthAccount.findOneAndUpdate(
      { provider: 'google', providerUserId: googleId },
      { $set: { userId: userObj._id, provider: 'google', providerUserId: googleId, email } },
      { upsert: true, new: true }
    );

    const accessToken = signAccessToken(userObj);
    const session = await issueSession(userObj._id, req.headers['user-agent'] || '', req.ip || '');

    res.json({
      accessToken,
      refreshToken: session.refreshToken,
      user: { id: String(userObj._id), email: userObj.email, credits: userObj.credits, name: userObj.name }
    });
  } catch (e) { respondWithError(res, e, 'Failed to authenticate with Google'); }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

    const session = await Session.findOne({ refreshToken }).lean();
    if (!session) return res.status(401).json({ error: 'Invalid refresh token' });
    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id });
      return res.status(401).json({ error: 'Refresh token expired' });
    }

    const user = await User.findById(session.userId).lean();
    if (!user) return res.status(401).json({ error: 'User not found' });

    const accessToken = signAccessToken(user);
    res.json({ accessToken });
  } catch (e) { respondWithError(res, e, 'Failed to refresh access token'); }
}

export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

    await Session.deleteMany({ refreshToken });
    res.json({ ok: true });
  } catch (e) { respondWithError(res, e, 'Failed to logout'); }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('email name credits createdAt').lean();
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ id: String(user._id), email: user.email, name: user.name, credits: user.credits, createdAt: user.createdAt });
  } catch (e) { respondWithError(res, e, 'Failed to fetch profile'); }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    const user = await User.findOne({ email }).lean();
    if (!user) return res.json({ message: 'If that email exists, a link has been sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await PasswordReset.create({ userId: user._id, token, expiresAt });

    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    await sendPasswordResetEmail(email, link);

    res.json({ message: 'If that email exists, a link has been sent.' });
  } catch (e) {
    respondWithError(res, e, 'Failed to initiate password reset');
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword)
      return res.status(400).json({ error: 'email, token, newPassword required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid reset token' });

    const pr = await PasswordReset.findOne({ userId: user._id, token, usedAt: null });
    if (!pr || pr.expiresAt < new Date()) return res.status(400).json({ error: 'Invalid or expired token' });

    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Sequential updates (Mongo transactions require replica set; keep it simple here)
    await User.findByIdAndUpdate(user._id, { passwordHash });
    await PasswordReset.findByIdAndUpdate(pr._id, { usedAt: new Date() });
    await Session.deleteMany({ userId: user._id });

    res.json({ message: 'Password updated' });
  } catch (e) { respondWithError(res, e, 'Failed to reset password'); }
}
