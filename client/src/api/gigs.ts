import { Gig, GigInput } from "../types/Gig";
import { client } from "../utils/fetchClient";

export const createGig = (data: GigInput): Promise<Gig> => {
  return client.post(`/gigs`, data);
};

export const addPhotosToGig = async (id: string, formData: FormData) => {
  const response = await fetch(`http://localhost:8800/api/gigs/${id}/files`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Не вдалося завантажити фото: ${response.statusText}`);
  }

  return response.json();
};

export const getGigs = (filters: any): Promise<Gig[]> => {
  const params = new URLSearchParams(filters).toString();

  return client.get(`/gigs?${params}`);
};

export const getGig = (id: string | undefined): Promise<Gig> => {
  return client.get(`/gigs/${id}`);
};

export const getGigByUser = (): Promise<Gig[]> => {
  return client.get(`/gigs/user`);
};

export const updateGig = (id: string, dataToUpdate: any): Promise<Gig> => {
  return client.patch(`/gigs/${id}`, dataToUpdate);
};

export const deleteGig = (id: string) => {
  return client.delete(`/gigs/${id}`);
};
