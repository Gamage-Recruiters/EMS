import express from 'express';
import {
    createLeaveRequest,
    getAllLeaveRequests,
    getMyLeaveRequests,
    getLeaveRequestById,
    updateLeaveRequestStatus,
    deleteLeaveRequest,
} from '../controllers/leaveController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all routes

router
    .route('/')
    .post(createLeaveRequest)
    .get(authorize('CEO', 'TL', 'PM'), getAllLeaveRequests);

router.get('/my-leaves', getMyLeaveRequests);

router
    .route('/:id')
    .get(getLeaveRequestById)
    .delete(deleteLeaveRequest);

router.put('/:id/status', authorize('CEO', 'TL', 'PM'), updateLeaveRequestStatus);

export default router;
