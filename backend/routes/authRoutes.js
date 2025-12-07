import express from 'express';
import { 
  registerUser, 
  loginUser, 
  googleAuth,
  refreshToken, 
  uploadProfileImage,
  assignRole
} from '../controllers/authController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth); 
router.post('/refresh-token', refreshToken);

// Profile Image Upload
router.post('/profile/upload', protect, upload.single('image'), uploadProfileImage);

// Role Assignment (CEO & TL)
router.put('/assign-role', protect, authorize('CEO', 'TL'), assignRole);

export default router;