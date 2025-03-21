import { User } from "./User";

type BidsStatus = "pending" | "accepted" | "rejected";

export interface BidInput {
  proposal: string;
  bidAmount: number;
  estimatedTime: number;
}

interface jobId {
  _id: string;
  employerId: string;
  title: string;
  step: string;
}

export interface Bid {
  _id: string;
  jobId: jobId;
  freelancerId: User;
  proposal: string;
  bidAmount: number;
  estimatedTime: string;
  status: BidsStatus;
  createdAt: string;
  updatedAt: string;
}
