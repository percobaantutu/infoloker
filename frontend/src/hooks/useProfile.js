import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

export const useProfile = () => {
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormData = {
    name: user?.name || "",
    email: user?.email || "",
    
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
  };

  const updateProfile = async (formData, fileData) => {
    setIsSubmitting(true);
    
    const data = new FormData();
    

    Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
    });

   
    if (fileData.avatar instanceof File) {
        data.append("avatar", fileData.avatar);
    }
    if (fileData.companyLogo instanceof File) {
        data.append("companyLogo", fileData.companyLogo);
    }
    
  
    if (fileData.resume instanceof File) {
        data.append("resume", fileData.resume);
    }

    try {
      const response = await axiosInstance.put(API_PATHS.USER.UPDATE_PROFILE, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      });
      
      updateUser(response.data);
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      console.error("Profile Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    initialFormData,
    isSubmitting,
    updateProfile,
  };
};