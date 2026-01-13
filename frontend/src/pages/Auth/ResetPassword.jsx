import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Loader, Eye, EyeOff } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await axiosInstance.put(API_PATHS.AUTH.RESET_PASSWORD(token), { password });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Token is invalid or expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p className="text-gray-500 mb-8">Create a new strong password for your account.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Enter new password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70 flex justify-center"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;