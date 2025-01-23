import { User } from "./User";

export type Review = {
  _id: string;
  star: number;
  review: string;
};

export type GigInput = {
  title: string | undefined;
  desc: string | undefined;
  shortTitle: string | undefined;
  shortDesc: string | undefined;
  cat: string;
  price: number | undefined;
  deliveryTime: number | undefined;
  userId: string | null;
  features: string[];
};

export interface FileUploadData {
  cover: File | null;
  images: File[];
}

export type Gig = {
  _id: string;
  userId: User;
  title: string;
  desc: string;
  rating: number;
  gigReviews: Review[];
  cat: string;
  price: number;
  cover: string;
  images: string[];
  shortTitle: string;
  shortDesc: string;
  deliveryTime: number;
  revisionNumber: number;
  features: string[];
  sales: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
