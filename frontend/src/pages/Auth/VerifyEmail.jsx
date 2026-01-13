import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Mail, Loader, RefreshCw, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";

const VerifyEmail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { updateUser } = useAuth(); 

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  

  const email = state?.email;
  if (!email) {
    navigate("/login");
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      return toast.error("Please enter a valid 6-digit code");
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_EMAIL, { email, otp });
      
      toast.success("Email verified successfully!");
      
    
      updateUser({ isVerified: true });

 
      const userRole = response.data.user?.role; 
      const target = userRole === "employer" ? "/employer-dashboard" : "/find-jobs";
      navigate(target);

    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESEND_OTP, { email });
      toast.success("New code sent to your email");
    } catch (error) {
      toast.error("Failed to resend code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
        <p className="text-gray-500 mb-8">
          We've sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span>. 
          Enter it below to confirm your account.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Numbers only
            className="w-full text-center text-3xl tracking-[0.5em] font-bold py-4 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors placeholder-gray-200"
            placeholder="000000"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-70"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Verify Account"}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <button 
            onClick={handleResend}
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Resend Code
          </button>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;