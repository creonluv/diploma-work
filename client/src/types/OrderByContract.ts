import { Job } from "./Job";
import { ReviewType } from "./Review";
import { User } from "./User";

type OrderStatus = "in-progress" | "completed" | "cancelled";
type PaymentStatus = "pending" | "paid" | "failed";

export interface OrderByContract {
  jobId: string;
  contractId: string;
  freelancerId: string;
  employerId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  payment_intent: string;
  totalAmount: number;
  startDate: string;
  endDate: string | null;
  reviewId: string | null;
  _id: string;
  reviews: ReviewStatus;
}

export interface OrderByUser {
  jobId: Job;
  contractId: string;
  freelancerId: User;
  employerId: User;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  payment_intent: string;
  totalAmount: number;
  startDate: string;
  endDate: string | null;
  reviewId: string | null;
  _id: string;
  reviews: ReviewStatus;
}

export interface OrderByContractResponse {
  clientSecret: string;
  newOrder: OrderByContract;
}

export interface OrderAction {
  orderId: string;
  action: "confirm" | "cancel";
}

export interface ReviewStatus {
  freelancer: ReviewType;
  employer: ReviewType;
}
