import { Router } from 'express';
import {
  register, login, googleAuth,
  refresh, logout, me,
  forgotPassword, resetPassword
} from '../controllers/authController.js';
import {authRequired}  from '../middleware/auth.js';

const router = Router();

// email/password
router.post('/register', register);
router.post('/login', login);

// google oauth (send idToken from frontend google sign-in)
router.post('/google', googleAuth);

// token lifecycle
router.post('/refresh', refresh);
router.post('/logout', logout);

// user
router.get('/me', authRequired, me);

// password reset
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);

export default router;
