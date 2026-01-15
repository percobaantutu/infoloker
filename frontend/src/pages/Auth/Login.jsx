import React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader, AlertCircle, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import Header from "../../components/Header";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const Login = () => {

  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.GOOGLE, {
        token: credentialResponse.credential,
      });

      const { token, ...userData } = res.data;
      login(userData, token);

      toast.success("Login successful!");
      
      const target = res.data.role === "employer" ? "/employer-dashboard" : "/find-jobs";
      navigate(target);
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Google Login Failed");
    }
  };

  const { formData, status, handleChange, togglePassword, submitLogin } = useLogin();

  // 1. Success View
  if (status.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-4">You have been successfully logged in.</p>
          <div className="w-6 h-6 border-2 border-blue-500 mx-auto border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 text-sm mt-2">Redirecting...</p>
        </motion.div>
      </div>
    );
  }

  // 2. Form View
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Header />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md my-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your infoloker account</p>
        </div>

        <form onSubmit={submitLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={status.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
              <button type="button" onClick={togglePassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {status.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Global Error Message */}
          {status.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-500">
              <AlertCircle className="w-4 h-4 mr-2" />
              <p className="text-red-700 text-sm">{status.error}</p>
            </div>
          )}

          <div className="flex justify-end">
  <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
    Forgot password?
  </Link>
</div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-gradient-to-r from-blue-600 to-gray-900 text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:from-blue-700 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed space-x-2 mt-6"
          >
            {status.loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          <div className="mt-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google Login Failed")}
                    theme="outline"
                    size="large"
                    width="100%"
                />
            </div>
        </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Create one here
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
