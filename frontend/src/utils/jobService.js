import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

export const createJob = async (jobPayload) => {
  const response = await axiosInstance.post(API_PATHS.JOBS.POST_JOB, jobPayload);
  return response.data;
};

export const updateJob = async (jobId, jobPayload) => {
  const response = await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), jobPayload);
  return response.data;
};
