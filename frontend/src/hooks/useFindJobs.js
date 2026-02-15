import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useDebounce } from "./useDebounce";
import { getCachedData, setCachedData } from "../utils/cacheUtils";
import toast from "react-hot-toast";

const CACHE_KEY_JOBS = "swr_jobs";

export const useFindJobs = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasRestoredCache = useRef(false);

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

  const isDefaultFilter = !debouncedKeyword && !debouncedLocation && !filters.category && !filters.type && !debouncedMinSalary && !debouncedMaxSalary;

  // Restore cached data on first mount (only for default/unfiltered view)
  useEffect(() => {
    if (hasRestoredCache.current) return;
    hasRestoredCache.current = true;

    if (isDefaultFilter) {
      const cached = getCachedData(CACHE_KEY_JOBS);
      if (cached?.data) {
        setJobs(cached.data);
        setIsLoading(false);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    // Only show loading spinner if we don't have any jobs to display yet
    if (jobs.length === 0) {
      setIsLoading(true);
    }
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

      // Cache only default (unfiltered) results
      if (isDefaultFilter) {
        setCachedData(CACHE_KEY_JOBS, response.data);
      }
    } catch (err) {
      console.error("Fetch Jobs Error:", err);
      // Only set error if we have no cached data to show
      if (jobs.length === 0) {
        setError("Failed to load jobs.");
      } else {
        toast.error("Could not refresh jobs. Showing cached data.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [debouncedKeyword, debouncedLocation, filters.category, filters.type, debouncedMinSalary, debouncedMaxSalary, user?._id, isDefaultFilter]); // eslint-disable-line react-hooks/exhaustive-deps

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