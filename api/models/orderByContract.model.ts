import mongoose from "mongoose";
const { Schema } = mongoose;

const orderByContractSchema = new Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "closed"],
      default: "in-progress",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    payment_intent: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    reviews: {
      freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        default: null,
      },
      employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderByContractSchema);
