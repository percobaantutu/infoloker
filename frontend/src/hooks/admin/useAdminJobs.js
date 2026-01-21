import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useDebounce } from "../useDebounce";
import toast from "react-hot-toast";

export const useAdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    page: 1
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (filters.status !== "All") params.append("status", filters.status);
      params.append("page", filters.page);

      const response = await axiosInstance.get(`${API_PATHS.ADMIN.JOBS}?${params.toString()}`);
      
      setJobs(response.data.jobs);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalJobs: response.data.totalJobs
      });
    } catch (error) {
      toast.error("Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [debouncedSearch, filters.status, filters.page]);

  const deleteJob = async (id) => {
    if (!window.confirm("Permanently delete this job?")) return;
    try {
      await axiosInstance.delete(API_PATHS.ADMIN.JOB_DELETE(id));
      setJobs(jobs.filter(j => j._id !== id));
      toast.success("Job deleted");
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  const toggleFeature = async (id) => {
    // Optimistic
    const original = [...jobs];
    setJobs(jobs.map(j => j._id === id ? { ...j, isFeatured: !j.isFeatured } : j));

    try {
      await axiosInstance.put(API_PATHS.ADMIN.JOB_FEATURE(id));
      toast.success("Job updated");
    } catch (error) {
      setJobs(original);
      toast.error("Failed to update feature status");
    }
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return {
    jobs,
    isLoading,
    pagination,
    filters,
    setFilters,
    deleteJob,
    toggleFeature,
    handlePageChange
  };
};