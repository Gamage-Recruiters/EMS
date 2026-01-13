import mongoose from "mongoose";

const availabilityCacheSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "UNAVAILABLE"],
      required: true,
    },

    reason: {
      type: String,
      default: "",
      trim: true,
    },

    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },

    // TTL Expiration field
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("AvailabilityCache", availabilityCacheSchema);
