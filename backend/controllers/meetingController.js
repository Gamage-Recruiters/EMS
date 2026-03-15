import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import User from "../models/User.js";

//normalize participant role
const ALLOWED_PARTICIPANT_ROLES = ["CEO", "TL", "ATL", "PM", "Developer"];

const normalizeParticipantRole = (role) => {
  return ALLOWED_PARTICIPANT_ROLES.includes(role) ? role : "Developer";
};

/**
 * @desc    Create a new meeting
 * @route   POST /api/meetings
 * @access  Private
 */
export const createMeeting = async (req, res) => {
  try {
    const {
      title,
      date,
      time,
      duration,
      meetingType,
      locationType,
      meetingLink,
      participants,
    } = req.body;

    // ================= BASIC VALIDATION =================
    if (
      !title ||
      !date ||
      !time ||
      !duration ||
      !meetingType ||
      !locationType
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    if (locationType === "online" && !meetingLink) {
      return res.status(400).json({
        success: false,
        message: "Meeting link is required for online meetings",
      });
    }

    // participants must be an array if provided
    if (participants !== undefined && !Array.isArray(participants)) {
      return res.status(400).json({
        success: false,
        message: "Participants must be an array",
      });
    }

    // ================= PARTICIPANTS PROCESS =================
    let formattedParticipants = [];

    if (Array.isArray(participants) && participants.length > 0) {
      for (const p of participants) {
        let user = null;

        // support participant by email
        if (p?.email) {
          user = await User.findOne({ email: p.email });
        }
        // support participant by user id
        else if (p?.user && mongoose.Types.ObjectId.isValid(p.user)) {
          user = await User.findById(p.user);
        } 
        // support sending direct objectId string
        else if (typeof p === "string" && mongoose.Types.ObjectId.isValid(p)) {
          user = await User.findById(p);
        } 
        else {
          return res.status(400).json({
            success: false,
            message: "Each participant must contain a valid email or user id",
          });
        }

        if (!user) {
          return res.status(404).json({
            success: false,
            message: `User not found`,
          });
        }

        formattedParticipants.push({
          user: user._id,
          role: user.role || "Developer",
        });
      }
    }

    // ================= CREATE MEETING =================
    const meeting = await Meeting.create({
      title,
      date,
      time,
      duration,
      meetingType,
      locationType,
      meetingLink: locationType === "online" ? meetingLink : "",
      createdBy: req.user.id,
      participants: formattedParticipants,
    });

    return res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully",
      data: meeting,
    });
  } catch (error) {
    console.error("Create meeting error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating meeting",
    });
  }
};

/**
 * @desc    Get users for meeting participant selection
 * @route   GET /api/users/participants
 * @access  Private
 */
export const getUsersForParticipants = async (req, res) => {
  try {
    const users = await User.find(
      { status: "Active" }, // only active users
      {
        firstName: 1,
        lastName: 1,
        email: 1,
        role: 1,
        profileImage: 1,
      }
    ).sort({ firstName: 1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};

/**
 * @desc    Get all meetings with participants
 * @route   GET /api/meetings
 * @access  Private
 */
export const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate({
        path: "createdBy",
        select: "firstName lastName email role profileImage",
      })
      .populate({
        path: "participants.user",
        select: "firstName lastName email role profileImage",
      })
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings,
    });
  } catch (error) {
    console.error("Get meetings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve meetings",
    });
  }
};

/**
 * @desc    Cancel a meeting
 * @route   PUT /api/meetings/:id/cancel
 * @access  Private
 */
export const cancelMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    // validate Mongo ObjectId first
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Permission check
    if (
      meeting.createdBy.toString() !== req.user.id &&
      !["CEO", "PM", "TL"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to cancel this meeting",
      });
    }

    meeting.status = "Cancelled";
    await meeting.save();

    return res.status(200).json({
      success: true,
      message: "Meeting cancelled successfully",
      data: meeting,
    });
  } catch (error) {
    console.error("Cancel meeting error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel meeting",
      error: error.message,
    });
  }
};

/**
 * @desc    Reschedule a meeting
 * @route   PUT /api/meetings/:id/reschedule
 * @access  Private
 */
export const rescheduleMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    // validate meeting id first
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // validate body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is required",
      });
    }

    const { title, date, time, duration, meetingLink } = req.body;

    // at least one field must be provided
    if (!title && !date && !time && !duration && !meetingLink) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to reschedule the meeting",
      });
    }

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Permission check
    if (
      meeting.createdBy.toString() !== req.user.id &&
      !["CEO", "PM", "TL"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to reschedule this meeting",
      });
    }

    if (title) meeting.title = title;
    if (date) meeting.date = date;
    if (time) meeting.time = time;
    if (duration) meeting.duration = duration;

    if (meeting.locationType === "online") {
      if (meetingLink) {
        meeting.meetingLink = meetingLink;
      }
    }

    meeting.status = "Scheduled";
    await meeting.save();

    return res.status(200).json({
      success: true,
      message: "Meeting rescheduled successfully",
      data: meeting,
    });
  } catch (error) {
    console.error("Reschedule meeting error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reschedule meeting",
      error: error.message,
    });
  }
};

/**
 * @desc    Get meetings assigned to logged-in developer
 * @route   GET /api/meetings/my
 * @access  Private (Developer)
 */
export const getMyAssignedMeetings = async (req, res) => {
  try {
    const userId = req.user.id;

    const meetings = await Meeting.find({
      "participants.user": userId,
      status: { $ne: "Cancelled" }, // optional: hide cancelled
    })
      .populate({
        path: "createdBy",
        select: "firstName lastName email role profileImage",
      })
      .populate({
        path: "participants.user",
        select: "firstName lastName email role profileImage",
      })
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings,
    });
  } catch (error) {
    console.error("Get assigned meetings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve assigned meetings",
    });
  }
};
