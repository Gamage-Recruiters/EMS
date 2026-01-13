import express from 'express';
import { checkIn, checkOut, deleteAttendance, getAllAttendance, getAttendanceById, getMyAttendance, getTodayAttendance } from '../controllers/attendanceController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Employee routes (protected)
router.post('/checkin', protect,checkIn);
router.put('/checkout',protect ,checkOut);
router.get('/',protect,authorize('CEO','TL','PM'),getAllAttendance);
router.get('/myAttendance',protect,getMyAttendance);
router.get('/todayAttendance',protect,getTodayAttendance);
router.get('/:id',protect,getAttendanceById);
router.delete('/:id',protect,authorize("CEO"),deleteAttendance);


export default router;