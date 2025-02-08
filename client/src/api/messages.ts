import {
  Conversation,
  MessageChat,
  MessageId,
  NewMessage,
} from "../types/Messages";
import { client } from "../utils/fetchClient";

export const getMessages = (): Promise<Conversation[]> => {
  return client.get(`/conversation/`);
};

export const updateMessages = (id: string, data: MessageId) => {
  return client.put(`/conversation/${id}`, data);
};

export const getMessagesChat = (
  id: string | undefined
): Promise<MessageChat[]> => {
  return client.get(`/message/${id}`);
};

export const createMessage = (
  data: NewMessage | undefined
): Promise<MessageChat> => {
  return client.post(`/message/`, data);
};
