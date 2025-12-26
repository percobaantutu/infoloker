import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Upload, Eye, EyeOff, UserCheck, Building2, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useSignUp } from "../../hooks/useSignUp";

const SignUp = () => {
  const { formData, status, handleChange, handleRoleChange, handleAvatarChange, togglePassword, submitSignUp } = useSignUp();

  // 1. Success View
  if (status.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account created!</h2>
          <p className="text-gray-600 mb-4">Welcome to infoloker! Your account has been successfully created</p>
          <div className="w-6 h-6 border-2 border-blue-500 mx-auto border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 text-sm mt-2">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // 2. Form View
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-sm text-gray-600">Join thousands of professionals finding their dream jobs</p>
        </div>

        <form onSubmit={submitSignUp} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={status.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Create a strong password"
              />
              <button type="button" onClick={togglePassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {status.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture (optional)</label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {status.avatarPreview ? <img src={status.avatarPreview} alt="Preview" className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-gray-400" />}
              </div>
              <div className="flex-1">
                <input type="file" id="avatar" accept=".jpg,.jpeg,.png" onChange={handleAvatarChange} className="hidden" />
                <label htmlFor="avatar" className="cursor-pointer bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors">
                  <Upload className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Upload Photo</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange("jobseeker")}
                className={`p-4 rounded-lg border-2 transition-all w-full text-left ${formData.role === "jobseeker" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}
              >
                <UserCheck className="w-6 h-6 mb-2" />
                <div className="font-semibold">Job Seeker</div>
                <div className="text-sm">Looking for opportunities</div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("employer")}
                className={`p-4 rounded-lg border-2 transition-all text-center ${formData.role === "employer" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}
              >
                <Building2 className="w-8 h-8 mx-auto mb-2" />
                <div className="font-medium">Employer</div>
                <div className="text-xs text-gray-500">Hiring talent</div>
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
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status.loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin mr-2" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          {/* Footer Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
