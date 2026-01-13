import express from 'express';
import {
  setAvailability,
  getMyAvailability,
  getTeamAvailability,
} from '../controllers/availabilityController.js';

import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, setAvailability);
router.get('/me', protect, getMyAvailability);

router.get(
  '/team',
  protect,
  authorize('CEO', 'PM', 'TL', 'ATL'),
  getTeamAvailability
);

export default router;
