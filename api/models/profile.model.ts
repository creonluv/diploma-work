import mongoose from "mongoose";
const { Schema } = mongoose;

const profileSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    userReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    profileType: {
      type: String,
      enum: ["freelancer", "employer"],
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },

    freelancerDetails: {
      skills: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tag",
        },
      ],
      portfolio: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
    },

    employerDetails: {
      projects: [
        {
          type: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", profileSchema);
