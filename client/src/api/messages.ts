import {
  Conversation,
  MessageChat,
  MessageId,
  NewMessage,
  PayloadConversation,
} from "../types/Messages";
import { client } from "../utils/fetchClient";

export const createConversation = (
  data: PayloadConversation
): Promise<Conversation> => {
  return client.post(`/conversation/`, data);
};

export const getMessages = (): Promise<Conversation[]> => {
  return client.get(`/conversation/`);
};

export const updateMessages = (id: string, data: MessageId) => {
  return client.put(`/conversation/${id}`, data);
};

export const markAsReadMessage = (id: string | null) => {
  return client.put(`/message/read/${id}`, null);
};

export const getMessagesChat = (
  id: string | null | undefined
): Promise<MessageChat[]> => {
  return client.get(`/message/${id}`);
};

export const createMessage = (
  data: NewMessage | undefined
): Promise<MessageChat> => {
  return client.post(`/message/`, data);
};
