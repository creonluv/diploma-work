import mongoose from "mongoose";
import User from "../models/user.model";
import Job from "../models/job.model";
import { validationResult } from "express-validator";

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

    console.log(req.body);

    const { title, description, budget, deadline, tags } = req.body;

    const newJob = new Job({
      employerId: userId,
      title,
      description,
      budget,
      deadline,
      tags,
    });

    await newJob.save();

    const savedJob = await Job.findById(newJob._id).populate("tags");

    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: "Error creating job", error });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("tags");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findById(jobId).populate("tags");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
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
