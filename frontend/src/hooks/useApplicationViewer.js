import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useApplicationViewer = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const fetchApplicants = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_APPLICANTS_FOR_JOB(jobId));

      const data = response.data;

      setApplicants(data);

      if (data.length > 0 && data[0].job) {
        setJobDetails(data[0].job);
      }
    } catch (error) {
      console.error("Fetch Applicants Error:", error);
      toast.error("Failed to load applicants.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    setUpdatingStatusId(applicationId);

    const originalApplicants = [...applicants];
    setApplicants((prev) => prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app)));

    try {
      await axiosInstance.put(API_PATHS.APPLICATIONS.UPDATE_STATUS(applicationId), { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Update Status Error:", error);
      toast.error("Failed to update status");
      setApplicants(originalApplicants); // Revert
    } finally {
      setUpdatingStatusId(null);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  return {
    applicants,
    jobDetails,
    isLoading,
    updatingStatusId,
    updateStatus,
  };
};
