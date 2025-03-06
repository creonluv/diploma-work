import { User } from "./User";

type BidsStatus = "pending" | "accepted" | "rejected";

export interface BidInput {
  proposal: string;
  bidAmount: number;
  estimatedTime: number;
}

export interface Bid {
  _id: string;
  jobId: string;
  freelancerId: User;
  proposal: string;
  bidAmount: number;
  estimatedTime: string;
  status: BidsStatus;
  createdAt: string;
  updatedAt: string;
}
