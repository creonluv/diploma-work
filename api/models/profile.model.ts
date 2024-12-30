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
    userRating: {
      type: Number,
      default: 0,
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

    // Поля для фрілансерів
    freelancerDetails: {
      skills: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
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
