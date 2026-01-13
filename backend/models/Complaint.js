import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    // ================= USER =================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ================= TYPE (DEVELOPERS) =================
    type: {
      type: String,
      enum: ["Bug", "Behavior", "Performance"],
      default: null, // admins will not use this
    },

    // ================= CONTENT =================
    subject: {
      // both developers and admins will use this
      type: String,
      required: true,
      trim: true,
    },

    description: {
      // both developers (details) and admins(context) will use this
      type: String,
      required: true,
      trim: true,
    },

    // ================= ADMIN-ONLY FIELDS =================
    urgency: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: null,
    },

    requiredAction: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    // ================= ATTACHMENT =================
    image: {
      type: String, // local file path
      default: "",
    },

    // ================= STATUS =================
    status: {
      type: String,
      enum: ["In Review", "Solved"],
      default: "In Review",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
