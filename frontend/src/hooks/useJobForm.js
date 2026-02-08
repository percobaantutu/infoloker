import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { validateJobForm } from "../utils/jobValidator";
import { createJob, updateJob } from "../utils/jobService";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useJobForm = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
    isFeatured: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (jobId) {
      const fetchJobDetails = async () => {
        setIsLoading(true);
        try {
          const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_BY_ID(jobId));
          const job = response.data;

          setFormData({
            jobTitle: job.title,
            location: job.location,
            category: job.category,
            jobType: job.type,
            description: job.description,
            requirements: job.requirements,
            salaryMin: String(job.salaryMin),
            salaryMax: String(job.salaryMax),
            isFeatured: job.isFeatured || false,
          });
        } catch (error) {
          console.error("Fetch error:", error);
          toast.error("Failed to load job details");
          navigate("/employer-dashboard");
        } finally {
          setIsLoading(false);
        }
      };

      fetchJobDetails();
    }
  }, [jobId, navigate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || errors.salary) {
      setErrors((prev) => ({ ...prev, [field]: undefined, salary: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateJobForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const jobPayload = {
      title: formData.jobTitle,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      category: formData.category,
      type: formData.jobType,
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
      isFeatured: formData.isFeatured,
    };

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
      const msg = error.response?.data?.message || "Failed to save job.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => Object.keys(validateJobForm(formData)).length === 0;

  return {
    formData,
    errors,
    isSubmitting,
    isLoading,
    handleInputChange,
    handleSubmit,
    isFormValid,
    isEditMode: !!jobId,
  };
};
