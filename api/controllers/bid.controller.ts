import { validationResult } from "express-validator";
import Bid from "../models/bid.model";
import Job from "../models/job.model";
import User from "../models/user.model";

export const addBidToJob = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { jobId } = req.params;
    const { proposal, bidAmount, estimatedTime } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user || user.isSeller) {
      return res
        .status(403)
        .json({ message: "Only freelancers can place bids." });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingBid = await Bid.findOne({ jobId, freelancerId: userId });
    if (existingBid) {
      return res
        .status(400)
        .json({ message: "You have already placed a bid on this job." });
    }

    const newBid = new Bid({
      jobId,
      freelancerId: userId,
      proposal,
      bidAmount,
      estimatedTime,
    });

    await newBid.save();
    job.bids.push(newBid._id);
    await job.save();

    res.status(201).json(newBid);
  } catch (error) {
    res.status(500).json({ message: "Error placing bid", error });
  }
};

export const getBidsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const bids = await Bid.find({ jobId }).populate("freelancerId");

    if (!bids.length) {
      return res.status(404).json({ message: "No bids found for this job" });
    }

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bids", error });
  }
};

export const updateBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const { proposal, bidAmount, estimatedTime } = req.body;
    const userId = req.userId;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    if (bid.freelancerId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only update your own bids." });
    }

    bid.proposal = proposal || bid.proposal;
    bid.bidAmount = bidAmount || bid.bidAmount;
    bid.estimatedTime = estimatedTime || bid.estimatedTime;

    await bid.save();
    res.status(200).json(bid);
  } catch (error) {
    res.status(500).json({ message: "Error updating bid", error });
  }
};

export const deleteBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const userId = req.userId;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    if (bid.freelancerId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own bids." });
    }

    await Bid.findByIdAndDelete(bidId);

    res.status(200).json({ message: "Bid deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bid", error });
  }
};
