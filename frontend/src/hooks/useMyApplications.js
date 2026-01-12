import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

export const useMyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS);
      setApplications(response.data);
    } catch (err) {
      console.error("Fetch Applications Error:", err);
      setError("Failed to load your applications.");
      toast.error("Could not load applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    isLoading,
    error,
    refresh: fetchApplications // Expose refresh if needed later
  };
};