import mongoose from "mongoose";
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["gig", "user"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "type",
    },
    raterUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    star: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
    review: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewSchema);
