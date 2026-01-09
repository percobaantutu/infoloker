import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, User, Camera, Save, Loader } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import InputField from "../../components/Input/InputField";
import TextAreaField from "../../components/Input/TextAreaField";
import { useProfile } from "../../hooks/useProfile";

const EditProfileDetails = () => {
  const navigate = useNavigate();
  const { user, updateProfile, isSubmitting } = useProfile();

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    companyDescription: "",
  });

  const [files, setFiles] = useState({
    avatar: null,
    companyLogo: null,
  });

  const [previews, setPreviews] = useState({
    avatar: "",
    companyLogo: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        companyName: user.companyName || "",
        companyDescription: user.companyDescription || "",
      });
      setPreviews({
        avatar: user.avatar || "",
        companyLogo: user.companyLogo || "",
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }));

      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [field]: objectUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await updateProfile(formData, files);

    if (success) {
      navigate("/company-profile");
    }
  };

  return (
    <DashboardLayout activeMenu="company-profile">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/company-profile")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Images Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Branding & Images</h2>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Company Logo Upload */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                  <div className="relative group w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden hover:border-blue-500 transition-colors">
                    {previews.companyLogo ? (
                      <img src={previews.companyLogo} alt="Logo Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-xs text-gray-500">Click to upload</span>
                      </div>
                    )}

                    {/* Overlay */}
                    <label htmlFor="companyLogo" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-8 h-8 text-white" />
                    </label>
                    <input type="file" id="companyLogo" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "companyLogo")} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Recommended: 500x500px, PNG or JPG.</p>
                </div>

                {/* Avatar Upload */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Avatar</label>
                  <div className="flex items-center gap-4">
                    <div className="relative group w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                      {previews.avatar ? <img src={previews.avatar} alt="Avatar Preview" className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-gray-400" />}

                      <label htmlFor="avatar" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-6 h-6 text-white" />
                      </label>
                      <input type="file" id="avatar" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "avatar")} />
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>This image will be displayed on your profile and internal dashboard.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Company Details Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Company Name" id="companyName" value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)} placeholder="e.g. Acme Corp" icon={Building2} />

                <InputField label="Account Name" id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Your Full Name" icon={User} />
              </div>

              <TextAreaField
                label="About the Company"
                id="companyDescription"
                value={formData.companyDescription}
                onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                placeholder="Tell us about your company, culture, and mission..."
                rows={5}
                helperText="This description will appear on your public profile and job postings."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4">
              <button type="button" onClick={() => navigate("/company-profile")} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 mr-4 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditProfileDetails;
