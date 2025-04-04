import Notification from "../models/notification.model";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .populate("userId", "username profileImage")
      .populate("sellerId", "username profileImage")
      .populate("jobId", "_id title description budget")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, isRead: false },
      { isRead: true }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notifications", error });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error });
  }
};

export const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.userId });
    res.json({ message: "All notifications deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notifications", error });
  }
};
