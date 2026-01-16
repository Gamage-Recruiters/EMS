import mongoose from "mongoose";

const dailyTaskSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    task: {
      type: String,
      required: true,
      trim: true,
    },

    project: {
      type: String,
      required: true,
    },

    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ================= STATUS =================
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Blocked", "Completed"],
      default: "Not Started",
    },

    // ================= TIME =================
    startTime: {
      type: String, // HH:mm
    },

    endTime: {
      type: String, // HH:mm
    },

    workingHours: {
      type: String, // ex: 02:30
    },

    // ================= NOTES =================
    facedIssues: {
      type: String,
      default: "",
    },

    learnings: {
      type: String,
      default: "",
    },

    // ================= CHECKS =================
    pmCheck: {
      type: String,
      enum: ["Pending", "Done", "Issue", "Not Completed"],
      default: "Pending",
    },

    teamLeadCheck: {
      type: String,
      enum: ["Pending", "Done", "Issue", "Not Completed"],
      default: "Pending",
    },

    // ================= DATE =================
    date: {
      type: Date,
      default: () => new Date().setHours(0, 0, 0, 0), // auto-save submit date
    },
  },
  { timestamps: true }
);

export default mongoose.model("DailyTask", dailyTaskSchema);
