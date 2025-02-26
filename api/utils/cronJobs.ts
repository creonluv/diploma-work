import cron from "node-cron";
import Job from "../models/job.model";

const closeExpiredJobs = async () => {
  try {
    const now = new Date();
    const expiredJobs = await Job.find({
      status: "open",
      expiresAt: { $lte: now },
    });

    for (const job of expiredJobs) {
      job.status = "closed";
      await job.save();
      console.log(`Closed job: ${job._id}`);
    }
  } catch (error) {
    console.error("Error closing expired jobs:", error);
  }
};

cron.schedule("*/5 * * * *", closeExpiredJobs);
console.log("Cron job for closing expired jobs is running.");
