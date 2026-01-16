import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
/**
 * @desc    Create a complaint (Developer)
 * @route   POST /api/complaints
 * @access  Private
 */
export const createComplaint = async (req, res) => {
  try {
    const { type, subject, description } = req.body;

    // ================= BASIC VALIDATION =================
    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: "Subject and description are required",
      });
    }

    // Developers must provide complaint type
    if (req.user.role === "Developer" && !type) {
      return res.status(400).json({
        success: false,
        message: "Complaint type is required for developers",
      });
    }

    // ================= IMAGE PATH =================
    const imagePath = req.file ? req.file.path : "";

    // ================= CREATE COMPLAINT =================
    const complaint = await Complaint.create({
      user: req.user.id,
      type: req.user.role === "Developer" ? type : null,
      subject,
      description,
      image: imagePath,
      // urgency, department, requiredAction -> admin only
      // status -> default "In Review"
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit complaint",
    });
  }
};

/**
 * @desc    Get logged-in user's complaints (Developer)
 * @route   GET /api/complaints/my
 * @access  Private
 */
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error("Get my complaints error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve complaints",
    });
  }
};

/**
 * @desc    Get all developer complaints (PM / TL / CEO)
 * @route   GET /api/complaints/developers
 * @access  Private
 */
export const getDeveloperComplaints = async (req, res) => {
  try {
    // Role check
    if (!["PM", "TL", "CEO"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // 1️⃣ Get all developer user IDs
    const developers = await User.find({ role: "Developer" }, { _id: 1 });

    const developerIds = developers.map((dev) => dev._id);

    // 2️⃣ Find complaints created by developers
    const complaints = await Complaint.find({
      user: { $in: developerIds },
    })
      .populate({
        path: "user",
        select: "firstName lastName email profileImage",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error("Get developer complaints error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve developer complaints",
    });
  }
};

/**
 * @desc    Update complaint status (PM / TL / CEO only)
 * @route   PUT /api/complaints/:id/status
 * @access  Private (PM / TL / CEO)
 */
export const updateComplaintStatus = async (req, res) => {
  try {
    // Role check
    if (!["PM", "TL", "CEO"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update complaint status",
      });
    }

    const { status } = req.body;

    // Validate status
    if (!["In Review", "Solved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    complaint.status = status;
    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Update complaint status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update complaint status",
    });
  }
};

/**
 * @desc    Create complaint by Admin (PM / TL / CEO)
 * @route   POST /api/complaints/admin
 * @access  Private (PM / TL / CEO)
 */
export const createAdminComplaint = async (req, res) => {
  try {
    // Role check
    if (!["PM", "TL", "CEO"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only PM, TL, or CEO can create admin complaints",
      });
    }

    const { subject, description, urgency, department, requiredAction } =
      req.body;

    // ================= VALIDATION =================
    if (
      !subject ||
      !description ||
      !urgency ||
      !department ||
      !requiredAction
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Subject, description, urgency, department and required action are required",
      });
    }

    // ================= IMAGE =================
    const imagePath = req.file ? req.file.path : "";

    // ================= CREATE COMPLAINT =================
    const complaint = await Complaint.create({
      user: req.user.id,
      subject,
      description,
      urgency,
      department,
      requiredAction,
      image: imagePath,
      type: null, // explicitly no type
      status: "In Review",
    });

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Admin create complaint error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create complaint",
    });
  }
};

/**
 * @desc    Get complaints created by PM / TL / CEO
 * @route   GET /api/complaints/admin
 * @access  Private (CEO / PM/TL only)
 */
export const getAdminComplaints = async (req, res) => {
  try {
    // Role check
    if (!["CEO", "PM", "TL"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // 1️⃣ Get PM, TL, CEO user IDs
    const adminUsers = await User.find(
      { role: { $in: ["PM", "TL", "CEO"] } },
      { _id: 1 }
    );

    const adminUserIds = adminUsers.map((u) => u._id);

    // 2️⃣ Find complaints created by those users
    const complaints = await Complaint.find({
      user: { $in: adminUserIds },
    })
      .populate({
        path: "user",
        select: "firstName lastName email role profileImage",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error("Get admin complaints error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve admin complaints",
    });
  }
};
