import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSavedJobs = async () => {
    setIsLoading(true);
    try {
    
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS + "/my");
      
    
      setSavedJobs(response.data);
    } catch (error) {
      console.error("Fetch Saved Jobs Error:", error);
      toast.error("Failed to load saved jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const removeSavedJob = async (jobId) => {
    // 1. Optimistic Update (Remove from UI immediately)
    const originalList = [...savedJobs];
    setSavedJobs((prev) => prev.filter((item) => item.job._id !== jobId));

    try {
      // 2. API Call
      await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
      toast.success("Job removed from saved list");
    } catch (error) {
      // 3. Revert on error
      console.error("Remove Error:", error);
      toast.error("Failed to remove job");
      setSavedJobs(originalList);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  return {
    savedJobs,
    isLoading,
    removeSavedJob,
  };
};