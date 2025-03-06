import { Skill } from "./Skill";

export interface JobInput {
  title: string;
  description: string | undefined;
  shortTitle: string | undefined;
  shortDesc: string | undefined;
  cat: string;
  budget: number;
  deadline: string;
  tags: String[];
}

type Profile = {
  _id: string;
  userId: string;
  description: string;
  location: string;
  userRating: number;
  userReviews: string[];
  profileType: "freelancer" | "employer";
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type Employer = {
  _id: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  isSeller: boolean;
  createdAt: string;
  updatedAt: string;
  publicKey: string;
  __v?: number;
  profileId: Profile;
};

export type Job = {
  _id: string;
  employerId: Employer;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  tags: Skill[];
  bids: any[];
  cat: string;
  status: "open" | "closed";
  views: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  daysLeft: number;
};
