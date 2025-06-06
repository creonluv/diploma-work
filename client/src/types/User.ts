export interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  isSeller: boolean;
  createdAt: string;
  updatedAt: string;
  publicKey: string;
  userRating: number;
  profileId: string;
  profileImage: string;
}
