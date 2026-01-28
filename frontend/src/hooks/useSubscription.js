import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useSubscription = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const subscribe = async (planType) => {
    setIsLoading(true);
    try {
      // 1. Ask Backend for the Snap Token
      const response = await axiosInstance.post(API_PATHS.SUBSCRIPTION.CREATE_TRANSACTION, {
        planType,
      });

      const { token } = response.data;

      // 2. Open Midtrans Popup
      if (window.snap) {
        window.snap.pay(token, {
          onSuccess: function (result) {
            toast.success("Payment Successful!");
            console.log(result);
            navigate("/employer-dashboard");
           
          },
          onPending: function (result) {
            toast("Waiting for payment...");
            console.log(result);
          },
          onError: function (result) {
            toast.error("Payment Failed");
            console.error(result);
          },
          onClose: function () {
            toast("Payment popup closed");
          },
        });
      } else {
        toast.error("Payment gateway not loaded. Check internet connection.");
      }

    } catch (error) {
      console.error("Subscription Error:", error);
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setIsLoading(false);
    }
  };

  return { subscribe, isLoading };
};