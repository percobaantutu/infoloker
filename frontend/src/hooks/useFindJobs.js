import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useDebounce } from "./useDebounce";
import toast from "react-hot-toast";

export const useFindJobs = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    category: searchParams.get("category") || "",
    type: searchParams.get("type") || "",
    salaryMin: searchParams.get("minSalary") || "", 
    salaryMax: searchParams.get("maxSalary") || "", 
  });

  const debouncedKeyword = useDebounce(filters.keyword, 500);
  const debouncedLocation = useDebounce(filters.location, 500);
  
  const debouncedMinSalary = useDebounce(filters.salaryMin, 500);
  const debouncedMaxSalary = useDebounce(filters.salaryMax, 500);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedKeyword) params.set("keyword", debouncedKeyword);
    if (debouncedLocation) params.set("location", debouncedLocation);
    if (filters.category) params.set("category", filters.category);
    if (filters.type) params.set("type", filters.type);
    
    if (debouncedMinSalary) params.set("minSalary", debouncedMinSalary);
    if (debouncedMaxSalary) params.set("maxSalary", debouncedMaxSalary);
    
    setSearchParams(params, { replace: true });
  }, [debouncedKeyword, debouncedLocation, filters.category, filters.type, debouncedMinSalary, debouncedMaxSalary, setSearchParams]);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (debouncedKeyword) params.append("keyword", debouncedKeyword);
      if (debouncedLocation) params.append("location", debouncedLocation);
      if (filters.category) params.append("category", filters.category);
      if (filters.type) params.append("type", filters.type);
      
      if (debouncedMinSalary) params.append("minSalary", debouncedMinSalary);
      if (debouncedMaxSalary) params.append("maxSalary", debouncedMaxSalary);
      
      if (user?._id) params.append("userId", user._id);

      const response = await axiosInstance.get(`${API_PATHS.JOBS.GET_ALL_JOBS}?${params.toString()}`);
      setJobs(response.data);
    } catch (err) {
      console.error("Fetch Jobs Error:", err);
      setError("Failed to load jobs.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedKeyword, debouncedLocation, filters.category, filters.type, debouncedMinSalary, debouncedMaxSalary, user?._id]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const toggleSaveJob = async (jobId) => {
    if (!isAuthenticated) {
      toast.error("Please login to save jobs");
      return;
    }
    const originalJobs = [...jobs];
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
      )
    );
    try {
      const job = jobs.find((j) => j._id === jobId);
      if (job.isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        toast.success("Job removed from saved list");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        toast.success("Job saved successfully");
      }
    } catch (err) {
      setJobs(originalJobs);
      toast.error("Failed to update saved job");
    }
  };

  return {
    jobs,
    isLoading,
    error,
    filters,
    setFilters,
    toggleSaveJob,
  };
};