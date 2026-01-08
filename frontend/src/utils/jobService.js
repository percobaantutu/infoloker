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

export const getJobsEmployer = async () => {
  const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);
  return response.data;
};

export const toggleJobStatus = async (jobId) => {
  const response = await axiosInstance.put(API_PATHS.JOBS.TOGGLE_CLOSE(jobId));
  return response.data;
};

export const deleteJob = async (jobId) => {
  const response = await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(jobId));
  return response.data;
};
