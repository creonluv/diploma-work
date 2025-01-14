import { Skill } from "./Skill";
import { User } from "./User";

interface FreelancerDetails {
  skills?: Skill[];
  portfolio: any[];
}

interface EmployerDetails {
  companyName: string;
  projects: any[];
  contactPerson: string;
}

export interface Profile {
  _id: string;
  userId: User;
  description: string;
  location: string;
  userRating: number;
  userReviews: any[];
  freelancerDetails?: FreelancerDetails;
  employerDetails?: EmployerDetails;
  profileType: "freelancer" | "employer";
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
