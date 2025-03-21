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
}

export interface OrderByContractResponse {
  clientSecret: string;
  newOrder: OrderByContract;
}

export interface OrderAction {
  orderId: string;
  action: "confirm" | "cancel";
}
