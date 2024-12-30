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
    proposedBudget: {
      type: Number,
      required: true,
    },
    deliveryTime: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Bid", bidSchema);
