import Meeting from "../models/Meeting.js";
import User from "../models/User.js";

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

    // ================= PARTICIPANTS PROCESS =================
    let formattedParticipants = [];

    if (participants && participants.length > 0) {
      for (const p of participants) {
        const user = await User.findOne({ email: p.email });

        if (!user) {
          return res.status(404).json({
            success: false,
            message: `User not found: ${p.email}`,
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
    const meeting = await Meeting.findById(req.params.id);

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

    res.status(200).json({
      success: true,
      message: "Meeting cancelled successfully",
      data: meeting,
    });
  } catch (error) {
    console.error("Cancel meeting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel meeting",
    });
  }
};
