type User = {
  _id: string;
  username: string;
  profileImage: string;
};

type Job = {
  _id: string;
  title: string;
  description: string;
  budget: number;
};

export type INotification = {
  _id: string;
  userId: User;
  message: string;
  jobId?: Job;
  sellerId: User;
  createdAt: string;
  updatedAt: string;
};
