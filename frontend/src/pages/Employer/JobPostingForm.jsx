import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AlertCircle, MapPin, DollarSign, Briefcase, Users, Eye, Send, Loader, Sparkles, Building2 } from "lucide-react";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import InputField from "../../components/Input/InputField";
import SelectField from "../../components/Input/SelectField";
import TextAreaField from "../../components/Input/TextAreaField";
import JobPostingPreview from "../../components/layout/JobPostingPreview";
import { formatRupiah } from "../../utils/formatRupiah";
import { useJobForm } from "../../hooks/useJobForm";
import LocationSelect from "../../components/Input/LocationSelect";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const FEATURED_LIMITS = {
  free: 0,
  basic: 1,
  premium: 3,
  enterprise: Infinity,
};

const JobPostingForm = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { formData, errors, isSubmitting, handleInputChange, handleSubmit, isFormValid, isLoading, isEditMode } = useJobForm();

  const [isPreview, setIsPreview] = useState(false);

  const userPlan = user?.plan || "free";
  const featuredLimit = FEATURED_LIMITS[userPlan] || 0;
  const canFeature = featuredLimit > 0;

  // Check if company profile is complete
  const isProfileComplete = user?.companyName && user?.companyDescription && user?.companyLogo;

  // Translate Categories and Job Types for the SelectFields
  const translatedCategories = CATEGORIES.map(cat => ({
    ...cat,
    // Assumes keys like "categories.Engineering" exist in translation.json
    label: t(`categories.${cat.value}`) !== `categories.${cat.value}` ? t(`categories.${cat.value}`) : cat.label
  }));

  const translatedJobTypes = JOB_TYPES.map(type => ({
    ...type,
    // JOB_TYPES in data.js already has keys like "job.types.fullTime" in the label field
    label: t(type.label)
  }));

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="post-job">
        <div className="min-h-screen flex items-center justify-center">
          <Loader className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="post-job">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Incomplete Warning */}
          {!isProfileComplete && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800">Complete Your Company Profile</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Before posting jobs, please complete your company profile including company name, description, and logo.
                  </p>
                  <Link 
                    to="/company-profile" 
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-amber-700 hover:text-amber-900 underline"
                  >
                    Go to Company Profile →
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow-xl rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {isEditMode ? t('employer.editJob') : t('employer.postNewJob')}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{t('employer.postJobSubtitle')}</p>
              </div>
              <button
                onClick={() => setIsPreview(true)}
                disabled={!isFormValid() || !isProfileComplete}
                className="group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                <Eye className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>{t('common.preview')}</span>
              </button>
            </div>

            {/* Form Fields */}
            <div className={`space-y-6 ${!isProfileComplete ? 'opacity-50 pointer-events-none' : ''}`}>
              <InputField
                label={t('job.title')}
                id="jobTitle"
                placeholder={t('job.placeholders.title')}
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                error={errors.jobTitle}
                required
                icon={Briefcase}
              />

              <div className="flex-1">
                <LocationSelect
                  label={t('job.location')}
                  value={formData.location}
                  onChange={(value) => handleInputChange("location", value)}
                  error={errors.location}
                  placeholder={t('job.placeholders.location')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label={t('job.category')}
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  error={errors.category}
                  required
                  options={translatedCategories}
                  icon={Users}
                  placeholder={t('job.placeholders.selectCategory')}
                />
                <SelectField 
                  label={t('job.type')}
                  id="jobType" 
                  value={formData.jobType} 
                  onChange={(e) => handleInputChange("jobType", e.target.value)} 
                  error={errors.jobType} 
                  required 
                  options={translatedJobTypes} 
                  icon={Briefcase}
                  placeholder={t('job.placeholders.selectType')} 
                />
              </div>

              <TextAreaField
                label={t('job.description')}
                id="description"
                placeholder={t('job.placeholders.description')}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                error={errors.description}
                helperText={t('job.helpers.description')}
                required
              />

              <TextAreaField
                label={t('job.requirements')}
                id="requirements"
                placeholder={t('job.placeholders.requirements')}
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                error={errors.requirements}
                helperText={t('job.helpers.requirements')}
                required
              />

              {/* Salary Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{t('job.salaryRange')} (RP)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={t('job.salaryMin')}
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
                      placeholder={t('job.salaryMax')}
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

              {/* Featured Job Toggle - Only for Premium Users */}
              {canFeature && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Feature this job</p>
                        <p className="text-sm text-gray-600">
                          Featured jobs appear first in search results ({featuredLimit === Infinity ? 'Unlimited' : `${featuredLimit} slots`})
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:to-orange-500"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormValid()}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    t('employer.publishing')
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      {isEditMode ? t('employer.updateJob') : t('employer.publishJob')}
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