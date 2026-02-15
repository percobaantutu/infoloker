import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { Briefcase, DollarSign, Send, Loader, Sparkles, Building2 } from "lucide-react";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import { formatRupiah } from "../../utils/formatRupiah";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import LocationSelect from "../../components/Input/LocationSelect";

const AdminJobForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    adminCompanyName: "",
    title: "",
    location: "",
    category: "",
    type: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
    isFeatured: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.adminCompanyName.trim()) errs.adminCompanyName = "Company name is required";
    if (!formData.title.trim()) errs.title = "Job title is required";
    if (!formData.location.trim()) errs.location = "Location is required";
    if (!formData.category) errs.category = "Category is required";
    if (!formData.type) errs.type = "Job type is required";
    if (!formData.description.trim() || formData.description.length < 10) errs.description = "Description must be at least 10 characters";
    if (!formData.requirements.trim()) errs.requirements = "Requirements are required";
    if (formData.salaryMin && formData.salaryMax) {
      const min = Number(formData.salaryMin);
      const max = Number(formData.salaryMax);
      if (max < min) errs.salary = "Max salary must be greater than min salary";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post(API_PATHS.ADMIN.JOB_CREATE, {
        ...formData,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
      });
      toast.success("Job created successfully!");
      navigate("/admin/jobs");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create job";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-colors focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
      errors[field] ? "border-red-300 bg-red-50" : "border-gray-200"
    }`;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Job</h1>
          <p className="text-sm text-gray-500 mt-1">Create a job listing as admin. This job will show a "Posted by Admin" badge.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter company name for display"
                value={formData.adminCompanyName}
                onChange={(e) => handleChange("adminCompanyName", e.target.value)}
                className={`${inputClass("adminCompanyName")} pl-10`}
              />
            </div>
            {errors.adminCompanyName && <p className="text-xs text-red-600 mt-1">{errors.adminCompanyName}</p>}
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Developer"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={`${inputClass("title")} pl-10`}
              />
            </div>
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Location */}
          <LocationSelect
            value={formData.location}
            onChange={(val) => handleChange("location", val)}
            error={errors.location}
            label="Location"
            required
          />

          {/* Category & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className={inputClass("category")}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className={inputClass("type")}
              >
                <option value="">Select type</option>
                {JOB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.value}</option>
                ))}
              </select>
              {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              rows={5}
              placeholder="Describe the role, responsibilities, and what makes it exciting..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={inputClass("description")}
            />
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements *</label>
            <textarea
              rows={4}
              placeholder="List the qualifications, skills, and experience required..."
              value={formData.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              className={inputClass("requirements")}
            />
            {errors.requirements && <p className="text-xs text-red-600 mt-1">{errors.requirements}</p>}
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range (Rp)</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Min salary"
                  value={formatRupiah(formData.salaryMin)}
                  onChange={(e) => handleChange("salaryMin", e.target.value.replace(/\D/g, ""))}
                  className={`${inputClass("salary")} pl-10`}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Max salary"
                  value={formatRupiah(formData.salaryMax)}
                  onChange={(e) => handleChange("salaryMax", e.target.value.replace(/\D/g, ""))}
                  className={`${inputClass("salary")} pl-10`}
                />
              </div>
            </div>
            {errors.salary && <p className="text-xs text-red-600 mt-1">{errors.salary}</p>}
          </div>

          {/* Featured Toggle */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Feature this job</p>
                  <p className="text-sm text-gray-600">Featured jobs appear first in search results</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange("isFeatured", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:to-orange-500"></div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center px-4 py-3 text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Publish Job
              </>
            )}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminJobForm;
