import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Upload, Eye, EyeOff, UserCheck, Building2, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUp } from "../../hooks/useSignUp";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const { t } = useTranslation();
  const { formData, status, handleChange, handleRoleChange, handleAvatarChange, togglePassword, submitSignUp } = useSignUp();
  
  // Added missing hooks
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.GOOGLE, {
        token: credentialResponse.credential,
      });

      const { token, ...userData } = res.data;
      login(userData, token);
      
      toast.success(t('auth.registerSuccess'));
      
      const target = res.data.role === "employer" ? "/employer-dashboard" : "/find-jobs";
      navigate(target);
    } catch (error) {
      console.error("Google Signup Error:", error);
      toast.error(t('auth.googleSignupFailed'));
    }
  };

  // 1. Success View
  if (status.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.accountCreated')}</h2>
          <p className="text-gray-600 mb-4">{t('auth.accountCreatedDesc')}</p>
          <div className="w-6 h-6 border-2 border-blue-500 mx-auto border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 text-sm mt-2">{t('auth.redirectingDashboard')}</p>
        </motion.div>
      </div>
    );
  }

  // 2. Form View
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('auth.createAccount')}</h2>
          <p className="text-sm text-gray-600">{t('auth.signupSubtitle')}</p>
        </div>

        <form onSubmit={submitSignUp} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.fullName')} *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder={t('auth.enterFullName')}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.email')} *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder={t('auth.enterEmail')}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.password')} *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={status.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder={t('auth.createPasswordPlaceholder')}
              />
              <button type="button" onClick={togglePassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {status.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.profilePictureOptional')}</label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {status.avatarPreview ? <img src={status.avatarPreview} alt="Preview" className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-gray-400" />}
              </div>
              <div className="flex-1">
                <input type="file" id="avatar" accept=".jpg,.jpeg,.png" onChange={handleAvatarChange} className="hidden" />
                <label htmlFor="avatar" className="cursor-pointer bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors">
                  <Upload className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{t('profile.uploadPhoto')}</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">{t('auth.fileConstraints')}</p>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.role.label')} *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange("jobseeker")}
                className={`p-4 rounded-lg border-2 transition-all w-full text-left ${formData.role === "jobseeker" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}
              >
                <UserCheck className="w-6 h-6 mb-2" />
                <div className="font-semibold">{t('auth.role.jobseeker')}</div>
                <div className="text-sm">{t('auth.role.jobseekerDesc')}</div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("employer")}
                className={`p-4 rounded-lg border-2 transition-all text-center ${formData.role === "employer" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}
              >
                <Building2 className="w-8 h-8 mx-auto mb-2" />
                <div className="font-medium">{t('auth.role.employer')}</div>
                <div className="text-xs text-gray-500">{t('auth.role.employerDesc')}</div>
              </button>
            </div>
          </div>

          {/* Global Error */}
          {status.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
              <p className="text-red-700 text-sm">{status.error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-gradient-to-r from-blue-600 to-gray-900 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center hover:from-blue-700 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status.loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin mr-2" />
                <span>{t('auth.creatingAccount')}</span>
              </>
            ) : (
              <span>{t('auth.createAccount')}</span>
            )}
          </button>

           <div className="mt-6">
                      <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                              <span className="px-2 bg-white text-gray-500">{t('auth.orContinueWith')}</span>
                          </div>
                      </div>
          
                      <div className="mt-6 flex justify-center w-full">
                          <GoogleLogin
                              onSuccess={handleGoogleSuccess}
                              onError={() => toast.error(t('auth.googleSignupFailed'))}
                              theme="outline"
                              size="large"
                              width="100%"
                          />
                      </div>
                  </div>

          {/* Footer Link */}
          <div className="text-center">
            <p className="text-gray-600">
              {t('auth.alreadyHaveAccount')}{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                {t('auth.signInHere')}
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;