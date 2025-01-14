import { User } from "../types/User";
import { client } from "../utils/fetchClient";

export const getUser = (id: string): Promise<User> => {
  return client.get<User>(`/users/${id}`);
};
