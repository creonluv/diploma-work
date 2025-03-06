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

    // Поля для фрілансерів
    freelancerDetails: {
      skills: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tag",
        },
      ],
      portfolio: [
        {
          type: String,
        },
      ],
    },

    // Поля для роботодавців
    employerDetails: {
      companyName: {
        type: String,
        default: "",
      },
      projects: [
        {
          type: String,
        },
      ],
      contactPerson: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", profileSchema);
