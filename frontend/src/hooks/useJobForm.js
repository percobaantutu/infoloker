import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { validateJobForm } from "../utils/jobValidator";
import { createJob, updateJob } from "../utils/jobService";

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
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
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

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    isFormValid,
  };
};
