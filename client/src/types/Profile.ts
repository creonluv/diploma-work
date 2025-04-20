import { ReviewData } from "./Review";
import { Skill } from "./Skill";
import { User } from "./User";

interface FreelancerDetails {
  skills?: Skill[];
  portfolio: PortfolioItem[];
}

interface EmployerDetails {
  companyName: string;
  projects: PortfolioItem[];
  contactPerson: string;
}

export type PortfolioItem = {
  _id: string;
  title: string;
  description: string;
  budget: number;
  cat: string;
  updatedAt: string;
};

export interface Profile {
  _id: string;
  userId: User;
  description: string;
  location: string;
  userRating: number;
  userReviews: ReviewData[];
  freelancerDetails?: FreelancerDetails;
  employerDetails?: EmployerDetails;
  profileType: "freelancer" | "employer";
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  rating: number;
}
