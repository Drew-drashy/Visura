import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../config/prisma.js';
import { signAccessToken, generateRefreshToken } from '../utils/tokens.js';
import { sendPasswordResetEmail } from '../services/email.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/** Helpers */
async function issueSession(userId, userAgent, ip) {
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + parseDuration(process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'));
  const session = await prisma.session.create({
    data: { userId, refreshToken, userAgent, ip, expiresAt }
  });
  return session;
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

/** Auth flows */
export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash, name } });

    const accessToken = signAccessToken(user);
    const session = await issueSession(user.id, req.headers['user-agent'] || '', req.ip || '');

    res.json({
      accessToken,
      refreshToken: session.refreshToken,
      user: { id: user.id, email: user.email, credits: user.credits, name: user.name }
    });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const accessToken = signAccessToken(user);
    const session = await issueSession(user.id, req.headers['user-agent'] || '', req.ip || '');

    res.json({
      accessToken,
      refreshToken: session.refreshToken,
      user: { id: user.id, email: user.email, credits: user.credits, name: user.name }
    });
  } catch (e) { next(e); }
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

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email, name: payload.name, googleId } });
    } else if (!user.googleId) {
      user = await prisma.user.update({ where: { id: user.id }, data: { googleId } });
    }

    // link OAuthAccount (optional but nice)
    await prisma.oAuthAccount.upsert({
      where: { provider_providerUserId: { provider: 'google', providerUserId: googleId } },
      update: { email },
      create: { userId: user.id, provider: 'google', providerUserId: googleId, email }
    });

    const accessToken = signAccessToken(user);
    const session = await issueSession(user.id, req.headers['user-agent'] || '', req.ip || '');

    res.json({
      accessToken,
      refreshToken: session.refreshToken,
      user: { id: user.id, email: user.email, credits: user.credits, name: user.name }
    });
  } catch (e) { next(e); }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

    const session = await prisma.session.findUnique({ where: { refreshToken } });
    if (!session) return res.status(401).json({ error: 'Invalid refresh token' });
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } });
      return res.status(401).json({ error: 'Refresh token expired' });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const accessToken = signAccessToken(user);
    res.json({ accessToken });
  } catch (e) { next(e); }
}

export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

    await prisma.session.deleteMany({ where: { refreshToken } });
    res.json({ ok: true });
  } catch (e) { next(e); }
}

export async function me(req, res, next) {
  try {
    const me = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, credits: true, createdAt: true }
    });
    res.json(me);
  } catch (e) { next(e); }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ message: 'If that email exists, a link has been sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await prisma.passwordReset.create({
      data: { userId: user.id, token, expiresAt }
    });

    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    await sendPasswordResetEmail(email, link);

    res.json({ message: 'If that email exists, a link has been sent.' });
  } catch (e) { next(e); }
}

export async function resetPassword(req, res, next) {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword)
      return res.status(400).json({ error: 'email, token, newPassword required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid reset token' });

    const pr = await prisma.passwordReset.findFirst({
      where: { userId: user.id, token, usedAt: null }
    });
    if (!pr || pr.expiresAt < new Date()) return res.status(400).json({ error: 'Invalid or expired token' });

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
      prisma.passwordReset.update({ where: { id: pr.id }, data: { usedAt: new Date() } }),
      prisma.session.deleteMany({ where: { userId: user.id } }) // logout all sessions
    ]);

    res.json({ message: 'Password updated' });
  } catch (e) { next(e); }
}

export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: missing token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach minimal identity; load full user in controller if needed
    req.user = { id: payload.id, email: payload.email };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: invalid or expired token' });
  }
}