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
