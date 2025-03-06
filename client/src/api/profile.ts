import { Profile } from "../types/Profile";
import { client } from "../utils/fetchClient";

export const getProfile = (id: string): Promise<Profile> => {
  return client.get<Profile>(`/profiles/${id}`);
};

export const updateProfile = (id: string, data: any): Promise<Profile> => {
  console.log(data);
  return client.patch(`/profiles/${id}`, data);
};

export const updateProfileImage = async (
  userId: string,
  formData: FormData
) => {
  const response = await fetch(
    `http://localhost:8800/api/profiles/${userId}/update-profile-image`,
    {
      method: "PATCH",
      body: formData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update image profile: ${response.statusText}`);
  }

  return response.json();
};

export const addSkillToProfile = (id: string, data: any) => {
  return client.post(`/profiles/${id}/add-skills`, data);
};

export const removeSkillFromProfile = (id: string, data: any) => {
  return client.post(`/profiles/${id}/remove-skill`, data);
};
