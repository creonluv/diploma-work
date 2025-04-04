import { INotification } from "../types/Notifications";
import { client } from "../utils/fetchClient";

export const getNotifications = (): Promise<INotification[]> => {
  return client.get(`/notification/`);
};
