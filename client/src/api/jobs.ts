import { Job, JobInput, ResponseJob } from "../types/Job";
import { client } from "../utils/fetchClient";

export const createJob = (data: JobInput): Promise<Job> => {
  return client.post(`/job/`, data);
};

export const getJobs = (queryString: string): Promise<ResponseJob> => {
  return client.get(`/job?${queryString}`);
};

export const getJob = (id: string | undefined): Promise<Job> => {
  return client.get(`/job/${id}`);
};

export const updateJob = (id: string, dataToUpdate: any): Promise<Job> => {
  return client.patch(`/job/${id}`, dataToUpdate);
};

export const updateJobStep = (id: string, step: number) => {
  return client.patch(`/job/${id}/step`, { step });
};

export const deleteJob = (id: string) => {
  return client.delete(`/job/${id}`);
};
