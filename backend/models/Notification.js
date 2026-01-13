import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["INFO", "SUCCESS", "WARNING", "ERROR"],
      default: "INFO",
    },
    isRead: { type: Boolean, default: false },
    readAt: Date,
    relatedLink: String,
    relatedData: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
