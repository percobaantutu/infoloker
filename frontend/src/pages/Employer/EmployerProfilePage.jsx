import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, Edit, User, Globe, MapPin } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useProfile } from "../../hooks/useProfile";

const EmployerProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useProfile();

  if (!user) return null;

  return (
    <DashboardLayout activeMenu="company-profile">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 1. Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
            {/* Decorative Background */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-gray-900"></div>

            <div className="px-8 pb-8">
              <div className="relative flex justify-between items-end -mt-12 mb-6">
                {/* Company Logo */}
                <div className="w-32 h-32 bg-white rounded-2xl p-1 shadow-lg">
                  <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
                    {user.companyLogo ? <img src={user.companyLogo} alt="Company Logo" className="w-full h-full object-cover" /> : <Building2 className="w-12 h-12 text-gray-300" />}
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => navigate("/company-profile/edit")}
                  className="mb-2 flex items-center px-4 py-2 bg-white border border-gray-300 shadow-sm text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>

              {/* Basic Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.companyName || user.name}</h1>
                <p className="text-gray-500 font-medium mt-1 flex items-center">
                  <Mail className="w-4 h-4 mr-1.5" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: About */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">About the Company</h2>
                {user.companyDescription ? (
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{user.companyDescription}</p>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 mb-2">No description added yet.</p>
                    <button onClick={() => navigate("/company-profile/edit")} className="text-blue-600 hover:underline text-sm font-medium">
                      Add a description
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Contact / Info */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Account Details</h3>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3 shrink-0">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account Name</p>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mr-3 shrink-0">
                      <Globe className="w-4 h-4 text-gray-900" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Role</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{user.role}</p>
                    </div>
                  </div>

                  {/* You can add Location/Website fields later to the DB */}
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mr-3 shrink-0">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">Remote</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployerProfilePage;
