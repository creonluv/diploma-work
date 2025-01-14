import multer from "multer";
import Profile from "../models/profile.model";
import User from "../models/user.model";
import Tag from "../models/tag.model";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const uploadMiddleware = upload.single("profileImage");

export const updateProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    const userIdFromToken = req.userId;

    console.log(id);
    console.log(userIdFromToken);

    if (userIdFromToken !== id) {
      return res.status(403).json({
        message: "You can only update your own profile",
        id,
        userIdFromToken,
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profileImagePath = `/uploads/${req.file.filename}?t=${Date.now()}`;

    const profile = await Profile.findOne({ userId: id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.profileImage = profileImagePath;

    await profile.save();

    res.status(200).json(profile);
  } catch (error: any) {
    console.error("Error updating profile image:", error);
    res.status(500).json({
      message: "Failed to update profile image",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userIdFromToken = req.userId;
    const updates = req.body;

    console.log(id);
    console.log(userIdFromToken);

    if (userIdFromToken !== id) {
      return res.status(403).json({
        message: "You can only update your own profile",
        id,
        userIdFromToken,
      });
    }

    const profile = await Profile.findOneAndUpdate({ userId: id }, updates, {
      new: true,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (updates.username || updates.email) {
      await User.findByIdAndUpdate(id, {
        username: updates.username || undefined,
        email: updates.email || undefined,
      });
    }

    res.status(200).json(profile);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findOne({ userId: id })
      .populate("userId")
      .populate("freelancerDetails.skills");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to get profile", error: error.message });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("userId");

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ message: "No profiles found" });
    }

    res.status(200).json(profiles);
  } catch (error: any) {
    console.error("Error fetching profiles:", error);
    res
      .status(500)
      .json({ message: "Failed to get profiles", error: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userIdFromToken = req.userId;
    console.log(userIdFromToken);

    if (userIdFromToken !== id) {
      return res.status(403).json({
        message: "You can only delete your own profile",
        id: id,
        userIdFromToken: userIdFromToken,
      });
    }

    const profile = await Profile.findOneAndDelete({ userId: id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile and user deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting profile and user:", error);
    res.status(500).json({
      message: "Failed to delete profile and user",
      error: error.message,
    });
  }
};

export const addSkillsToProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { skillIds } = req.body;

    const existingTags = await Tag.find({ _id: { $in: skillIds } });

    if (existingTags.length !== skillIds.length) {
      return res.status(400).json({
        message: "Some tags do not exist in the database.",
      });
    }

    const profile = await Profile.findOne({ userId: id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    if (profile.profileType !== "freelancer") {
      return res
        .status(403)
        .json({ message: "Only freelancers can add skills." });
    }

    if (!profile.freelancerDetails) {
      profile.freelancerDetails = { skills: [], portfolio: [] };
    }

    const newSkills = skillIds.filter(
      (skillId) => !profile.freelancerDetails?.skills.includes(skillId)
    );

    profile.freelancerDetails.skills.push(...newSkills);

    await profile.save();

    res.status(200).json({
      message: "Skills added successfully.",
      skills: profile.freelancerDetails.skills,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to add skills to profile.",
      error: error.message,
    });
  }
};

export const removeSkillFromProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { skillId } = req.body;

    const profile = await Profile.findOne({ userId: id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    if (profile.profileType !== "freelancer") {
      return res
        .status(403)
        .json({ message: "Only freelancers can remove skills." });
    }

    if (!profile.freelancerDetails || !profile.freelancerDetails.skills) {
      return res.status(400).json({
        message: "No skills to remove.",
      });
    }

    const skillIndex = profile.freelancerDetails.skills.indexOf(skillId);

    if (skillIndex === -1) {
      return res.status(404).json({ message: "Skill not found in profile." });
    }

    profile.freelancerDetails.skills.splice(skillIndex, 1);

    await profile.save();

    res.status(200).json({
      message: "Skill removed successfully.",
      skills: profile.freelancerDetails.skills,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to remove skill from profile.",
      error: error.message,
    });
  }
};
