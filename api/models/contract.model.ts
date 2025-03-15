import mongoose from "mongoose";
const { Schema } = mongoose;

const contractSchema = new Schema(
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
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    agreedDeadline: {
      type: Date,
      required: true,
    },
    freelancerSignature: {
      type: String,
      default: null,
    },
    employerSignature: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "signed", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Contract", contractSchema);
