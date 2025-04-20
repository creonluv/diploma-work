import cron from "node-cron";
import notificationModel from "./models/notification.model";
import jobModel from "./models/job.model";

cron.schedule("*/10 * * * *", async () => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    await notificationModel.deleteMany({ createdAt: { $lt: oneWeekAgo } });

    const jobsWithStep3 = await jobModel.find({ step: 3 }).select("_id");

    const jobIds = jobsWithStep3.map((job) => job._id);

    await notificationModel.deleteMany({ jobId: { $in: jobIds } });

    console.log("Notifications cleanup completed");
  } catch (err) {
    console.error("Failed to clean notifications", err);
  }
});
