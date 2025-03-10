import { Job, JobInput } from "../types/Job";
import { client } from "../utils/fetchClient";

export const createJob = (data: JobInput): Promise<Job> => {
  return client.post(`/job/`, data);
};

export const getJobs = (): Promise<Job[]> => {
  return client.get(`/job/`);
};

export const getJob = (id: string | undefined): Promise<Job> => {
  return client.get(`/job/${id}`);
};

export const updateJob = (id: string, dataToUpdate: any): Promise<Job> => {
  return client.patch(`/job/${id}`, dataToUpdate);
};

export const deleteJob = (id: string) => {
  return client.delete(`/job/${id}`);
};
