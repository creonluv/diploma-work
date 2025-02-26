export type Order = {
  _id: string;
  gigId: string;
  img: string;
  title: string;
  price: number;
  sellerId: string;
  buyerId: string;
  sellerName: string;
  buyerName: string;
  isCompleted: boolean;
  payment_intent: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
