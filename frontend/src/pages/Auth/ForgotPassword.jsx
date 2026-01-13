import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader, CheckCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-600 mb-6">We sent a password reset link to {email}</p>
          <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <Link to="/login" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-500 mb-8">Enter your email and we'll send you instructions to reset your password.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70 flex justify-center"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;