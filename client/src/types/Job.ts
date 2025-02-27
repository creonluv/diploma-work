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

export interface Job {
  _id: string;
  employerId: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  tags: Skill[];
  bids: any[];
  status: "open" | "closed";
  views: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}
