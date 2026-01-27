import LeaveRequest from '../models/LeaveRequest.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import Attendance from '../models/Attendance.js';
import { getDatesBetween } from '../utils/dateUtils.js';

// @desc    Create a new leave request
// @route   POST /api/leaves
// @access  Private
export const createLeaveRequest = async (req, res, next) => {
    try {
        const { startDate, endDate, leaveType, reason } = req.body;

        // Validate dates
        if (new Date(startDate) > new Date(endDate)) {
            return next(new AppError('End date must be after start date', 400));
        }

        const leaveRequest = await LeaveRequest.create({
            employee: req.user._id,
            startDate,
            endDate,
            leaveType,
            reason,
        });

        res.status(201).json(leaveRequest);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private/Admin/Manager
export const getAllLeaveRequests = async (req, res, next) => {
    try {
        const leaveRequests = await LeaveRequest.find()
            .populate('employee', 'firstName lastName email role')
            .populate('approvedBy', 'firstName lastName');
        res.json(leaveRequests);
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user's leave requests
// @route   GET /api/leaves/my-leaves
// @access  Private
export const getMyLeaveRequests = async (req, res, next) => {
    try {
        const leaveRequests = await LeaveRequest.find({ employee: req.user._id })
            .sort({ createdAt: -1 });
        res.json(leaveRequests);
    } catch (error) {
        next(error);
    }
};

// @desc    Get leave request by ID
// @route   GET /api/leaves/:id
// @access  Private
export const getLeaveRequestById = async (req, res, next) => {
    try {
        const leaveRequest = await LeaveRequest.findById(req.params.id)
            .populate('employee', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName');

        if (!leaveRequest) {
            return next(new AppError('Leave request not found', 404));
        }

        // Check if user is authorized to view (owner or admin/manager)
        // Assuming CEO, TL, PM can view all, others only their own
        const authorizedRoles = ['CEO', 'TL', 'PM'];
        if (leaveRequest.employee._id.toString() !== req.user._id.toString() && !authorizedRoles.includes(req.user.role)) {
            return next(new AppError('Not authorized to view this request', 403));
        }

        res.json(leaveRequest);
    } catch (error) {
        next(error);
    }
};

// @desc    Update leave request status (Approve/Reject)
// @route   PUT /api/leaves/:id/status
// @access  Private/Admin/Manager
export const updateLeaveRequestStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return next(new AppError('Invalid status', 400));
        }

        const leaveRequest = await LeaveRequest.findById(req.params.id);

        if (!leaveRequest) {
            return next(new AppError('Leave request not found', 404));
        }

        leaveRequest.status = status;
        leaveRequest.approvedBy = req.user._id;

        const updatedLeaveRequest = await leaveRequest.save();

        if (status === 'Approved') {
            await syncLeaveToAttendance(updatedLeaveRequest);
        }

        res.status(200).json({
            success: true,
            message: `Leave request ${status.toLowerCase()}`,
            data: updatedLeaveRequest
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete leave request
// @route   DELETE /api/leaves/:id
// @access  Private
export const deleteLeaveRequest = async (req, res, next) => {
    try {
        const leaveRequest = await LeaveRequest.findById(req.params.id);

        if (!leaveRequest) {
            return next(new AppError('Leave request not found', 404));
        }

        // Only owner can delete if pending, or admin can delete?
        // Usually logical to allow delete if Pending.
        if (leaveRequest.employee.toString() !== req.user._id.toString()) {
            // Check if admin
            if (req.user.role !== 'CEO') {
                return next(new AppError('Not authorized to delete this request', 403));
            }
        }

        if (leaveRequest.status !== 'Pending' && req.user.role !== 'CEO') {
            return next(new AppError('Cannot delete processed leave request', 400));
        }

        await LeaveRequest.deleteOne({ _id: req.params.id });

        res.json({ message: 'Leave request removed' });

    } catch (error) {
        next(error);
    }
}



// @desc    Sync approved leave to attendance
// @route   INTERNAL (called after leave approval)
// @access  Private (Manager/Admin)
export const syncLeaveToAttendance = async (leaveRequest) => {
  const dates = getDatesBetween(
    new Date(leaveRequest.startDate),
    new Date(leaveRequest.endDate)
  );

  for (let date of dates) {
    date.setHours(0, 0, 0, 0);

    // Optional: skip weekends
    const day = date.getDay();
    if (day === 0 || day === 6) continue;

    const existingAttendance = await Attendance.findOne({
      employee: leaveRequest.employee,
      date: {
        $gte: date,
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!existingAttendance) {
      // Create attendance marked as On Leave
      await Attendance.create({
        employee: leaveRequest.employee,
        date,
        status: 'On Leave',
        isLeaveDay: true,
        workingHours: 0,
        checkInTime: null,
        checkOutTime: null
      });
    } else {
      // Update existing attendance
      existingAttendance.status = 'On Leave';
      existingAttendance.isLeaveDay = true;
      existingAttendance.checkInTime = null;
      existingAttendance.checkOutTime = null;
      existingAttendance.workingHours = 0;

      await existingAttendance.save();
    }
  }
};
