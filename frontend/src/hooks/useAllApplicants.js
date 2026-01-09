import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useAllApplicants = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch all applications
  const fetchAllApplications = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_ALL_EMPLOYER_APPLICATIONS);
      setApplications(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  // Update application status
  const updateStatus = async (applicationId, newStatus) => {
    setUpdatingStatusId(applicationId);

    const originalApplications = [...applications];
    setApplications((prev) => prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app)));

    try {
      await axiosInstance.put(API_PATHS.APPLICATIONS.UPDATE_STATUS(applicationId), { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Update Status Error:", error);
      toast.error("Failed to update status");
      setApplications(originalApplications);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Filtered applications (memoized for performance)
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch = app.applicant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  // Fetch on mount
  useEffect(() => {
    fetchAllApplications();
  }, []);

  return {
    applications: filteredApplications,
    totalApplications: applications.length,
    isLoading,
    updatingStatusId,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    updateStatus,
  };
};
