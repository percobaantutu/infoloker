import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { useSettings } from "../../hooks/admin/useSettings";
import { Save, AlertTriangle, ToggleLeft, ToggleRight, Loader } from "lucide-react";
import LoadingSpinner from "../../components/layout/LoadingSpinner";
import InputField from "../../components/Input/InputField";

const Toggle = ({ label, checked, onChange, description }) => (
  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
    <div>
      <h4 className="font-semibold text-gray-900">{label}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-300"}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  </div>
);

const SystemSettings = () => {
  const { settings, isLoading, isSaving, updateSettings } = useSettings();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  if (isLoading || !formData) return <LoadingSpinner />;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* General Settings */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">General Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Site Name" 
                value={formData.siteName} 
                onChange={(e) => handleChange("siteName", e.target.value)} 
              />
              <InputField 
                label="Support Email" 
                value={formData.supportEmail} 
                onChange={(e) => handleChange("supportEmail", e.target.value)} 
              />
            </div>
          </div>

          {/* Feature Flags */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Feature Controls</h2>
            <div className="space-y-4">
              <Toggle 
                label="Maintenance Mode" 
                description="Disable site access for non-admins."
                checked={formData.maintenanceMode}
                onChange={(val) => handleToggle("maintenanceMode", val)}
              />
              <Toggle 
                label="Allow Registrations" 
                description="Allow new users to sign up."
                checked={formData.allowRegistrations}
                onChange={(val) => handleToggle("allowRegistrations", val)}
              />
              <Toggle 
                label="Allow Job Posting" 
                description="Allow employers to post new jobs."
                checked={formData.allowJobPosting}
                onChange={(val) => handleToggle("allowJobPosting", val)}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
};

export default SystemSettings;