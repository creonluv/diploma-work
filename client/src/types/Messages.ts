export interface User {
  _id: string;
  email: string;
}

export interface LastMessage {
  _id: string;
  desc: string;
}

export interface MessageId {
  id: string;
}

export interface PayloadConversation {
  to: string;
}

export interface Conversation {
  _id: string;
  sellerId: User;
  buyerId: User;
  readBySeller: boolean;
  readByBuyer: boolean;
  lastMessage: LastMessage;
  createdAt: string;
  updatedAt: string;
}

interface UserChat {
  _id: string;
  username: string;
  profileImage: string;
}

export interface MessageChat {
  _id: string;
  conversationId: string;
  userId: UserChat;
  desc: string;
  isRead: boolean;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewMessage {
  conversationId: string | undefined | null;
  desc: string;
}
