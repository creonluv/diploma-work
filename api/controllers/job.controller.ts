import mongoose from "mongoose";
import User from "../models/user.model";
import Job from "../models/job.model";
import { validationResult } from "express-validator";
import profileModel from "../models/profile.model";
import Notification from "../models/notification.model";
import { io } from "../server";

export const createJob = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user || !user.isSeller) {
      return res.status(403).json({ message: "Only sellers can create jobs." });
    }

    const { title, description, budget, deadline, tags, cat } = req.body;

    const existingJob = await Job.findOne({
      employerId: userId,
      title,
      description,
    });

    if (existingJob) {
      return res.status(400).json({
        message:
          "You have already created a job with the same title and description.",
      });
    }

    const newJob = new Job({
      employerId: userId,
      title,
      description,
      budget,
      deadline,
      tags,
      cat,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    await newJob.save();

    const freelancers = await profileModel.find({
      "freelancerDetails.skills": { $in: tags },
    });

    const topFreelancers = freelancers.filter((freelancer) => {
      const matchingTags = freelancer?.freelancerDetails?.skills.filter(
        (skill) => tags.includes(skill.toString())
      );

      let matchPercentage;

      if (matchingTags) {
        matchPercentage = (matchingTags.length / tags.length) * 100;
      }

      return matchPercentage >= 40;
    });

    await Notification.insertMany(
      topFreelancers.map((freelancer) => ({
        userId: freelancer.userId,
        message: `${user.username} added:`,
        jobId: newJob._id,
        sellerId: user._id,
      }))
    );

    const newJobNotification = async (freelancers) => {
      freelancers.forEach((freelancer) => {
        console.log(`🔔 Sending notification to user ${freelancer.userId}`);

        io.to("global_chat").emit("notification", {
          message: `New job for you: ${newJob.title}`,
          jobId: newJob._id,
        });
      });
    };

    await newJobNotification(topFreelancers);

    const savedJob = await Job.findById(newJob._id).populate("tags");

    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: "Error creating job", error });
  }
};

export const getAllJobs = async (req, res, next) => {
  const q = req.query;

  const filters = {
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    ...(q.cat && { cat: q.cat }),
    ...(q.tags && { tags: { $in: q.tags.split(",") } }),
    ...(q.minBids && { bids: { $size: { $lte: Number(q.minBids) } } }),
    status: "open",
  };

  const allowedSortFields = ["budget", "createdAt", "views", "deadline"];
  const sortOption = {};

  if (q.sort && allowedSortFields.includes(q.sort)) {
    sortOption[q.sort] = -1;
  } else {
    sortOption["createdAt"] = -1;
  }

  const page = Number(q.page) || 1;
  const limit = Number(q.limit) || 3;
  const skip = (page - 1) * limit;

  try {
    const jobs = await Job.find(filters)
      .populate("tags")
      .populate({ path: "employerId", populate: { path: "profileId" } })
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalCount = await Job.countDocuments(filters);

    res.status(200).json({
      jobs,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserJobs = async (req, res, next) => {
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const jobs = await Job.find({ employerId: userId })
      .populate("tags")
      .populate({
        path: "employerId",
        populate: { path: "profileId" },
      });

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found for this user" });
    }

    res.status(200).json(jobs);
  } catch (err) {
    next(err);
  }
};

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    // if (!mongoose.Types.ObjectId.isValid(jobId)) {
    //   return res.status(400).json({ message: "Invalid job ID" });
    // }

    const job = await Job.findById(jobId)
      .populate("tags")
      .populate({ path: "employerId", populate: { path: "profileId" } });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.views += 1;
    await job.save();

    const timeLeft = new Date(job.expiresAt).getTime() - Date.now();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

    res
      .status(200)
      .json({ ...job.toObject(), daysLeft: daysLeft > 0 ? daysLeft : 0 });
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error });
  }
};

export const updateJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jobId } = req.params;
    const userId = req.userId;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employerId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this job" });
    }

    const user = await User.findById(userId);
    if (!user || !user.isSeller) {
      return res.status(403).json({ message: "Only sellers can update jobs." });
    }

    const { bids, ...updateData } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
      new: true,
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.userId;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employerId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this job" });
    }

    const user = await User.findById(userId);

    if (!user || !user.isSeller) {
      return res.status(403).json({ message: "Only sellers can delete jobs." });
    }

    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error });
  }
};

export const closeJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.userId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employerId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to close this job" });
    }

    const user = await User.findById(userId);

    if (!user || !user.isSeller) {
      return res.status(403).json({ message: "Only sellers can close jobs." });
    }

    job.status = "closed";
    await job.save();

    res.status(200).json({ message: "Job successfully closed" });
  } catch (error) {
    res.status(500).json({ message: "Error closing job", error });
  }
};

export const updateJobStep = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { step } = req.body;

    if (!Number.isInteger(step) || step < 1) {
      return res.status(400).json({ message: "Invalid step value" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.step = step;
    await job.save();

    res.status(200).json({ message: "Step updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Error updating job step", error });
  }
};
