import DashboardLayout from "../../components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { AlertCircle, MapPin, DollarSign, Briefcase, Users, Eye, Send } from "lucide-react";
import { API_PATHS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import toast from "react-hot-toast";
import InputField from "../../components/Input/InputField";
import SelectField from "../../components/Input/SelectField";
import TextAreaField from "../../components/Input/TextAreaField";
import JobPostingPreview from "../../components/layout/JobPostingPreview";
import { formatRupiah } from "../../utils/formatRupiah";

const JobPostingForm = () => {
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
  const [isPreview, setIsPreview] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Optional: clear error when user types
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
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
    };

    try {
      const response = jobId ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), jobPayload) : await axiosInstance.post(API_PATHS.JOBS.POST_JOB, jobPayload);

      if (response.status === 200 || response.status === 201) {
        toast.success(jobId ? "Job Updated Successfully!" : "Job Posted Successfully!");
        setFormData({
          jobTitle: "",
          location: "",
          category: "",
          jobType: "",
          description: "",
          requirements: "",
          salaryMin: "",
          salaryMax: "",
        });
        navigate("/employer-dashboard");
        return;
      }
      console.error("Unexpected response:", response);
      toast.error("Something went wrong. Please try again.");
    } catch (error) {
      if (error.response?.data?.message) {
        console.error("API Error:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Unexpected error:", error);
        toast.error("Failed to post/update job. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form validation helper

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.jobTitle.trim()) {
      errors.jobTitle = "Job title is required";
    }

    if (!formData.category) {
      errors.category = "Please select a category";
    }

    if (!formData.jobType) {
      errors.jobType = "Please select a job type";
    }

    if (!formData.description.trim()) {
      errors.description = "Job description is required";
    }

    if (!formData.requirements.trim()) {
      errors.requirements = "Job requirements are required";
    }

    if (!formData.salaryMin || !formData.salaryMax) {
      errors.salary = "Both minimum and maximum salary are required";
    } else if (parseInt(formData.salaryMin) >= parseInt(formData.salaryMax)) {
      errors.salary = "Minimum salary must be less than maximum salary";
    }

    return errors;
  };

  const isFormValid = () => {
    const validationErrors = validateForm(formData);
    return Object.keys(validationErrors).length === 0;
  };

  return (
    <DashboardLayout activeMenu="post-job">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto ">
          <div className="bg-white shadow-xl rounded-2xl p-6 ">
            <div className="flex items-center justify-between">
              <div className="flex-col items-center justify-between mb-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Post a New Job</h2>
                <p className="text-sm text-gray-600 mt-1">Fill out the form below to create your job posting</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPreview(true)}
                  disabled={!isFormValid()}
                  className="group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Eye className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
            <div className="space-y-6">
              <InputField
                label="Job Title"
                id="jobTitle"
                placeholder="e.g., Senior Software Engineer"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                error={errors.jobTitle}
                required
                icon={Briefcase}
              />
              <div className="space-y-4">
                <div className="fle flex-col sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0 space-y-4">
                  <div className="flex-1">
                    <InputField label="Location" id="location" placeholder="e.g., New York, NY" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} error={errors.location} required icon={MapPin} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Category"
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  error={errors.category}
                  required
                  options={CATEGORIES}
                  icon={Users}
                  placeholder="Select a category"
                />
                <SelectField label="Job Type" id="jobType" value={formData.jobType} onChange={(e) => handleInputChange("jobType", e.target.value)} error={errors.jobType} required options={JOB_TYPES} icon={Briefcase} />
              </div>
              <TextAreaField
                label="Job Description"
                id="description"
                placeholder="Describe the role and responsibilities..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                error={errors.description}
                helperText="Include key responsibilities, day-to-day tasks, and what  makes this role exciting."
                required
              />
              <TextAreaField
                label="Requirements"
                id="requirements"
                placeholder="List key and qualifications..."
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                error={errors.requirements}
                helperText="Include key responsibilities, day-to-day tasks, and what  makes this role exciting."
                required
              />
              <div className="space-y-2">
                <label htmlFor="" className="block text-sm font-medium text-gray-700">
                  Salary Range (RP)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Minimum Salary"
                      value={formatRupiah(formData.salaryMin)}
                      onChange={(e) => handleInputChange("salaryMin", e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outine-none focus:ring-2 focus:ring-blue-500 focus:ring-opacitiy-50 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Maximum Salary"
                      value={formatRupiah(formData.salaryMax)}
                      onChange={(e) => handleInputChange("salaryMax", e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outine-none focus:ring-2 focus:ring-blue-500 focus:ring-opacitiy-50 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                </div>
                {errors.salary && (
                  <div className="flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span>{errors.salary}</span>
                  </div>
                )}
              </div>
              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormValid()}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className=""></div>
                      Publishing Job...
                    </>
                  ) : (
                    <>
                      <Send className="" />
                      Publish Job
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPreview && <JobPostingPreview data={formData} onClose={() => setIsPreview(false)} />}
    </DashboardLayout>
  );
};

export default JobPostingForm;
