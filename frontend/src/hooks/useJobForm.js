import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { validateJobForm } from "../utils/jobValidator";
import { createJob, updateJob } from "../utils/jobService";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useJobForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Text/Select Inputs
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear specific error when user types
    if (errors[field] || errors.salary) {
      setErrors((prev) => ({ ...prev, [field]: undefined, salary: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate
    const validationErrors = validateJobForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // 2. Prepare Payload
    const jobPayload = {
      title: formData.jobTitle,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      category: formData.category,
      type: formData.jobType,
      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),
    };

    // 3. Call API
    try {
      if (jobId) {
        await updateJob(jobId, jobPayload);
        toast.success("Job Updated Successfully!");
      } else {
        await createJob(jobPayload);
        toast.success("Job Posted Successfully!");
      }

      navigate("/employer-dashboard");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to save job. Please try again.";
      console.error("Job Submit Error:", error);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => Object.keys(validateJobForm(formData)).length === 0;

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (jobId) {
        try {
          const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_BY_ID(jobId));
          const jobData = response.data;
          if (jobData) {
            setFormData({
              jobTitle: jobData.title,
              location: jobData.location,
              category: jobData.category,
              jobType: jobData.type,
              description: jobData.description,
              requirements: jobData.requirements,
              salaryMin: jobData.salaryMin,
              salaryMax: jobData.salaryMax,
            });
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
          if (error.response) {
            console.error("API Error:", error.response.data.message);
          }
        }
      }
    };
    fetchJobDetails();
    return () => {};
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    isFormValid,
  };
};
