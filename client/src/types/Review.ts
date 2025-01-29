interface User {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
}

export interface ReviewType {
  _id: string;
  type: "gig" | "user";
  targetId: string;
  raterUserId: User;
  star: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewData {
  type: "gig" | "user";
  targetId: string | undefined;
  star: number;
  review: string;
}
