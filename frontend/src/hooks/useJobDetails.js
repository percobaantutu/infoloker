import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAuth } from "../context/AuthContext";

export const useJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);


  const fetchJobData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_BY_ID(jobId));
      setJob(response.data);
      
      if (isAuthenticated) {
        await checkUserStatus(jobId);
      }
    } catch (err) {
      console.error("Fetch Job Error:", err);
      setError("Job not found or has been removed.");
    } finally {
      setLoading(false);
    }
  }, [jobId, isAuthenticated]);

  const checkUserStatus = async (id) => {
    try {
        const [appsRes, savedRes] = await Promise.all([
            axiosInstance.get(API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS),
            axiosInstance.get(`${API_PATHS.JOBS.GET_SAVED_JOBS}/my`)   
        ]);

        const application = appsRes.data.find(app => 
            (app.job._id === id) || (app.job === id)
        );
        if (application) setHasApplied(true);

   
        const saved = savedRes.data.find(item => 
            (item.job._id === id) || (item.job === id)
        );
        if (saved) setIsSaved(true);

    } catch (error) {
        console.warn("Could not verify user status", error);
    }
  };

  useEffect(() => {
    if (jobId) fetchJobData();
  }, [fetchJobData]);

  
  const applyToJob = async () => {
    if (!isAuthenticated) {
        toast.error("Please login to apply");
        navigate("/login");
        return;
    }
    

    if (!user?.resume) {
        toast.error("You need a resume to apply. Please upload one in your profile.");
        navigate("/profile"); 
        return;
    }

    setIsApplying(true);
    try {
        await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
        toast.success("Application submitted successfully!");
        setHasApplied(true);
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to apply";
        toast.error(msg);
    } finally {
        setIsApplying(false);
    }
  };

  const toggleSave = async () => {
    if (!isAuthenticated) {
        toast.error("Please login to save jobs");
        return;
    }
    
    const prevSaved = isSaved;
    setIsSaved(!isSaved); 

    try {
        if (prevSaved) {
            await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
            toast.success("Removed from saved jobs");
        } else {
            await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
            toast.success("Job saved");
        }
    } catch (error) {
        setIsSaved(prevSaved);
        toast.error("Action failed");
    }
  };

  return { 
    job, 
    loading, 
    error, 
    hasApplied, 
    isSaved, 
    isApplying, 
    applyToJob, 
    toggleSave,
    user, 
  };
};