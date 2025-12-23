import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    title: {
      type: String,
      required: true,
      trim: true,
    },

    meetingType: {
      type: String,
      enum: [
        "Daily Standup",
        "Sprint Planning",
        "Code Review",
        "Special Meeting",
      ],
      required: true,
    },

    // ================= DATE & TIME =================
    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String, // HH:mm (from frontend)
      required: true,
    },

    duration: {
      type: String, // ex: "30 mins", "1 hour"
      required: true,
    },

    // ================= LOCATION =================
    locationType: {
      type: String,
      enum: ["online", "in-person"],
      required: true,
    },

    meetingLink: {
      type: String,
      default: "",
    },

    // ================= USERS =================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["CEO", "TL", "ATL", "PM", "Developer"],
          default: "Developer",
        },
      },
    ],

    // ================= STATUS =================
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);
