import { Skill } from "../types/Skill";
import { client } from "../utils/fetchClient";

export const getAllSkills = (): Promise<Skill[]> => {
  return client.get<Skill[]>(`/tags`);
};
