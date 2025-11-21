import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  refresh,
  logout,
  me,
  updateMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import {authRequired}  from '../middleware/auth.js';

const router = Router();

// email/password
router.post('/register', register);
router.post('/login', login);


router.post('/google', googleAuth);

// token lifecycle
router.post('/refresh', refresh);
router.post('/logout', logout);

// user
router.get('/me', authRequired, me);
router.put('/me', authRequired, updateMe);

// password reset
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);

export default router;
