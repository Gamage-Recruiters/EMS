import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import Team from "../models/Team.js";
import AppError from "../utils/AppError.js";
import { clearAvailabilityOnCheckout } from "./availabilityController.js";

/**
 * @desc    Check-in (Create new attendance record)
 * @route   POST /api/attendance/checkin
 * @access  Private
 */
export const checkIn = async (req, res, next) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employee: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingAttendance) {
      return next(new AppError("Already checked in today", 400));
    }

    const checkInTime = new Date();
    const workStartTime = new Date();
    workStartTime.setHours(9, 30, 0, 0); // Work starts at 9:30 AM

    let status = "Present";
    if (checkInTime > workStartTime) {
      status = "Late";
    }

    const attendance = await Attendance.create({
      employee: req.user._id,
      date: today,
      checkInTime,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Checked in successfully",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check-out (Update existing attendance record)
 * @route   PUT /api/attendance/checkout
 * @access  Private
 */
export const checkOut = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      employee: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!attendance) {
      return next(
        new AppError("No check-in record found for today", 404)
      );
    }

    if (attendance.checkOutTime) {
      return next(
        new AppError("Already checked out today", 400)
      );
    }

    const checkOutTime = new Date();

    // Calculate working hours
    const workingMilliseconds =
      checkOutTime - attendance.checkInTime;
    const workingHours = (
      workingMilliseconds /
      (1000 * 60 * 60)
    ).toFixed(2);

    attendance.checkOutTime = checkOutTime;
    attendance.workingHours = parseFloat(workingHours);

    await attendance.save();

    // 🔥 CLEAR AVAILABILITY CACHE ON CHECKOUT
    await clearAvailabilityOnCheckout(req.user._id);

    res.status(200).json({
      success: true,
      message: "Checked out successfully",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all employees attendance (Admin/Manager)
 * @route   GET /api/attendance
 * @access  Private/Admin/Manager
 */
export const getAllAttendance = async (req, res, next) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    const query = {};

    if (employeeId) {
      query.employee = employeeId;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendanceRecords = await Attendance.find(query)
      .populate("employee", "firstName lastName email role")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      data: attendanceRecords,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my attendance records
 * @route   GET /api/attendance/my-attendance
 * @access  Private
 */
export const getMyAttendance = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { employee: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      };
    }

    const attendanceRecords = await Attendance.find(query).sort({
      date: -1,
    });

    res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      data: attendanceRecords,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get today's attendance status
 * @route   GET /api/attendance/today
 * @access  Private
 */
export const getTodayAttendance = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    res.status(200).json({
      success: true,
      data: attendance,
      hasCheckedIn: !!attendance,
      hasCheckedOut: attendance
        ? !!attendance.checkOutTime
        : false,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete attendance record (CEO only)
 * @route   DELETE /api/attendance/:id
 * @access  Private/CEO
 */
export const deleteAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return next(
        new AppError("Attendance record not found", 404)
      );
    }

    if (req.user.role !== "CEO") {
      return next(
        new AppError(
          "Not authorized to delete this record",
          403
        )
      );
    }

    await Attendance.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendance by ID
 * @route   GET /api/attendance/:id
 * @access  Private
 */
export const getAttendanceById = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate(
      "employee",
      "firstName lastName email"
    );

    if (!attendance) {
      return next(
        new AppError("Attendance record not found", 404)
      );
    }

    const authorizedRoles = ["CEO", "TL", "PM"];
    if (
      attendance.employee._id.toString() !==
        req.user._id.toString() &&
      !authorizedRoles.includes(req.user.role)
    ) {
      return next(
        new AppError("Not authorized to view this record", 403)
      );
    }

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get monthly attendance summary (Present, Absent, Late, Leave) grouped by month
 * @route   GET /api/attendance/monthly-summary
 * @access  Private
 */
export const getMonthlySummary = async (req, res, next) => {
  try {
    const role = req.user.role;
    const userId = req.user._id || req.user.id;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const queryEmployeeId = req.query.employeeId;

    const startOfYear = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
    const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

    const matchQuery = {
      date: { $gte: startOfYear, $lte: endOfYear }
    };

    // Role Based Employee Filtering (CEO and PM can view all/selected employees)
    if (role === "CEO" || role === "PM") {
      if (queryEmployeeId && 
          queryEmployeeId !== "all" && 
          queryEmployeeId !== "" && 
          queryEmployeeId !== "undefined" && 
          queryEmployeeId !== "null" && 
          mongoose.isValidObjectId(queryEmployeeId)) {
        matchQuery.employee = new mongoose.Types.ObjectId(queryEmployeeId.toString());
      }
    } else if (role === "TL") {
      // Find teams led by TL
      const teamLeadId = userId ? new mongoose.Types.ObjectId(userId.toString()) : undefined;
      const teams = await Team.find({ teamLead: teamLeadId });
      const memberIds = teams.flatMap(team => (team.members || []).map(member => member.toString()));
      if (userId) {
        memberIds.push(userId.toString()); // Include TL themselves
      }
      const uniqueMembers = [...new Set(memberIds)];

      if (queryEmployeeId && 
          queryEmployeeId !== "all" && 
          queryEmployeeId !== "" && 
          queryEmployeeId !== "undefined" && 
          queryEmployeeId !== "null" && 
          mongoose.isValidObjectId(queryEmployeeId)) {
        if (uniqueMembers.includes(queryEmployeeId.toString())) {
          matchQuery.employee = new mongoose.Types.ObjectId(queryEmployeeId.toString());
        } else {
          return next(new AppError("Not authorized to view this employee's attendance summary", 403));
        }
      } else {
        matchQuery.employee = { $in: uniqueMembers.filter(id => mongoose.isValidObjectId(id)).map(id => new mongoose.Types.ObjectId(id.toString())) };
      }
    } else {
      // Developer / Regular user
      if (userId && mongoose.isValidObjectId(userId)) {
        matchQuery.employee = new mongoose.Types.ObjectId(userId.toString());
      } else {
        return next(new AppError("Invalid or missing user ID in session", 400));
      }
    }

    const results = await Attendance.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $month: "$date" },
          present: {
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] }
          },
          absent: {
            $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] }
          },
          late: {
            $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] }
          },
          leave: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$status", "On Leave"] },
                    { $eq: ["$status", "leave"] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlySummary = Array.from({ length: 12 }, (_, i) => ({
      month: monthNames[i],
      present: 0,
      absent: 0,
      late: 0,
      leave: 0
    }));

    results.forEach(item => {
      const monthIdx = item._id - 1;
      if (monthIdx >= 0 && monthIdx < 12) {
        monthlySummary[monthIdx].present = item.present;
        monthlySummary[monthIdx].absent = item.absent;
        monthlySummary[monthIdx].late = item.late;
        monthlySummary[monthIdx].leave = item.leave;
      }
    });

    // Filter out months that have no attendance activity (all 0s)
    const filteredSummary = monthlySummary.filter(
      item => item.present > 0 || item.absent > 0 || item.late > 0 || item.leave > 0
    );

    res.status(200).json({
      success: true,
      data: filteredSummary
    });
  } catch (error) {
    next(error);
  }
};
