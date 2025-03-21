import mongoose from "mongoose";
const { Schema } = mongoose;

const bidSchema = new Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    proposal: {
      type: String,
      required: true,
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    estimatedTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bid", bidSchema);
