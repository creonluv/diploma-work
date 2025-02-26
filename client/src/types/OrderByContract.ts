type OrderStatus = "in-progress" | "completed" | "cancelled";
type PaymentStatus = "pending" | "completed" | "failed";

interface NewOrder {
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
  newOrder: NewOrder;
}
