import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Save, Loader, UploadCloud, FileText, CheckCircle } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import InputField from "../../components/Input/InputField";
import { useProfile } from "../../hooks/useProfile";

const EditUserProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, isSubmitting } = useProfile();

  const [formData, setFormData] = useState({ name: "" });
  const [files, setFiles] = useState({ avatar: null, resume: null });
  const [previews, setPreviews] = useState({ avatar: "" });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "" });
      setPreviews({ avatar: user.avatar || "" });
    }
  }, [user]);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }));
      
      // Only preview images
      if (field === "avatar") {
        setPreviews((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateProfile(formData, files);
    if (success) navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          
          <div className="mb-8 flex items-center gap-4">
            <button 
                onClick={() => navigate("/profile")} 
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Avatar Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-sm shrink-0">
                {previews.avatar ? (
                  <img src={previews.avatar} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><User className="w-8 h-8 text-gray-400" /></div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label htmlFor="avatar" className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
                        Choose Image
                    </label>
                    <span className="text-xs text-gray-500">JPG or PNG, max 5MB</span>
                </div>
                <input type="file" id="avatar" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "avatar")} />
              </div>
            </div>

            {/* 2. Personal Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h2>
              <InputField 
                label="Full Name" 
                id="name"
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={User}
              />
            </div>

            {/* 3. Resume Upload */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Resume / CV</h2>
              <p className="text-sm text-gray-500 mb-4">Upload your CV in PDF format (Max 5MB).</p>
              
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors relative ${files.resume ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                <input 
                    type="file" 
                    id="resume" 
                    accept=".pdf" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e, "resume")}
                />
                
                {files.resume ? (
                    <div className="flex flex-col items-center text-green-700">
                        <FileText className="w-10 h-10 mb-2" />
                        <span className="font-medium text-gray-900">{files.resume.name}</span>
                        <span className="text-xs mt-1 font-medium">Ready to upload</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-gray-500">
                        <UploadCloud className="w-10 h-10 mb-2 text-gray-300" />
                        <span className="font-medium text-sm text-gray-700">Click to upload PDF</span>
                        <span className="text-xs mt-1 text-gray-400">or drag and drop</span>
                    </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
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
      </main>
     
      <Footer />
       
    </div>
  );
};

export default EditUserProfile;