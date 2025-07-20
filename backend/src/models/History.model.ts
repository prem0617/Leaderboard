import mongoose from "mongoose";

// interface for the history model
interface History {
  userId: mongoose.Types.ObjectId; // Reference to User model
  pointsClaimed: number;
  claimedAt: Date;
}

// schema for history
const HistorySchema = new mongoose.Schema<History>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pointsClaimed: {
      type: Number,
      required: true,
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Model of history
const HistoryModel = mongoose.model<History>("History", HistorySchema);

export default HistoryModel;
