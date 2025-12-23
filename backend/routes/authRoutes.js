import express from 'express';
import {
  registerUser,
  loginUser,
  googleAuth,
  refreshToken,
} from '../controllers/authController.js';

const router = express.Router();

// Public auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/refresh', refreshToken);

export default router;
