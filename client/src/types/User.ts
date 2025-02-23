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
  encryptedPrivateKey: string;
  __v?: number;
  profileId: string;
  profileImage: string;
}
