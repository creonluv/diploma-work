import { Job } from "./Job";
import { User } from "./User";

export interface ContractInput {
  jobId: string | null;
  freelancerId: string | null;
  employerId: string | null;
  bidId: string | null;
  totalAmount: number;
  agreedDeadline: string;
}

export interface SignContractInput {
  contractText: string;
  role: string;
  userId: string | null;
}

export interface Contract {
  jobId: Job;
  freelancerId: User;
  employerId: User;
  bidId: string;
  totalAmount: number;
  agreedDeadline: string;
  freelancerSignature: string | null;
  employerSignature: string | null;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ContractResponse {
  message: string;
  contract: Contract;
}

export interface ContractsResponse {
  message: string;
  contracts: Contract[];
}

export interface SignedContract {
  _id: string;
  jobId: string;
  freelancerId: string;
  employerId: string;
  bidId: string;
  totalAmount: number;
  agreedDeadline: string;
  freelancerSignature: string;
  status: "pending" | "signed" | "rejected";
}
