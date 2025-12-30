import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AlertCircle, MapPin, DollarSign, Briefcase, Users, Eye, Send } from "lucide-react";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import InputField from "../../components/Input/InputField";
import SelectField from "../../components/Input/SelectField";
import TextAreaField from "../../components/Input/TextAreaField";
import JobPostingPreview from "../../components/layout/JobPostingPreview";
import { formatRupiah } from "../../utils/formatRupiah";
import { useJobForm } from "../../hooks/useJobForm";

const JobPostingForm = () => {
  const { formData, errors, isSubmitting, handleInputChange, handleSubmit, isFormValid } = useJobForm();

  const [isPreview, setIsPreview] = useState(false);

  return (
    <DashboardLayout activeMenu="post-job">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Post a New Job</h2>
                <p className="text-sm text-gray-600 mt-1">Fill out the form below to create your job posting</p>
              </div>
              <button
                onClick={() => setIsPreview(true)}
                disabled={!isFormValid()}
                className="group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                <Eye className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Preview</span>
              </button>
            </div>

            {/* Form Fields */}
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

              <div className="flex-1">
                <InputField label="Location" id="location" placeholder="e.g., New York, NY" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} error={errors.location} required icon={MapPin} />
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
                placeholder="Describe the role..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                error={errors.description}
                helperText="Include key responsibilities."
                required
              />

              <TextAreaField
                label="Requirements"
                id="requirements"
                placeholder="List key qualifications..."
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                error={errors.requirements}
                helperText="Include necessary skills."
                required
              />

              {/* Salary Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Salary Range (RP)</label>
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
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
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
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {errors.salary && (
                  <div className="flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.salary}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormValid()}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    "Publishing Job..."
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
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
