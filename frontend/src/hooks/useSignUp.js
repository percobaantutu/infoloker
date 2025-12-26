import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateEmail, validatePassword, validateAvatar } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useSignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    avatar: null, // Stores the File object
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
    avatarPreview: null, // Stores the URL for display
    showPassword: false,
  });

  // 1. Handle Text Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors specific to field name if you had field-specific errors
    if (status.error) setStatus((prev) => ({ ...prev, error: null }));
  };

  // 2. Handle Role Selection
  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  // 3. Handle File Upload & Preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate File
      const error = validateAvatar(file);
      if (error) {
        setStatus((prev) => ({ ...prev, error }));
        return;
      }

      // Update State
      setFormData((prev) => ({ ...prev, avatar: file }));

      // Generate Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setStatus((prev) => ({ ...prev, avatarPreview: e.target.result, error: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePassword = () => {
    setStatus((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const validate = () => {
    if (!formData.fullName) return "Full Name is required";
    const emailErr = validateEmail(formData.email);
    if (emailErr) return emailErr;
    const passErr = validatePassword(formData.password);
    if (passErr) return passErr;
    if (!formData.role) return "Please select a role";
    return null;
  };

  const submitSignUp = async (e) => {
    e.preventDefault();
    const errorMsg = validate();
    if (errorMsg) {
      setStatus((prev) => ({ ...prev, error: errorMsg }));
      return;
    }

    setStatus((prev) => ({ ...prev, loading: true, error: null }));

    // Prepare FormData
    const data = new FormData();
    data.append("name", formData.fullName);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);
    if (formData.avatar) {
      data.append("avatar", formData.avatar);
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, data);

      // Extract User and Token
      const { token, ...userData } = response.data;

      // Update Context
      login(response.data, token);

      setStatus((prev) => ({ ...prev, loading: false, success: true }));

      // Redirect
      setTimeout(() => {
        const target = formData.role === "employer" ? "/employer-dashboard" : "/find-jobs";
        window.location.href = target;
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed. Please try again.";
      setStatus((prev) => ({ ...prev, loading: false, error: msg }));
    }
  };

  return {
    formData,
    status,
    handleChange,
    handleRoleChange,
    handleAvatarChange,
    togglePassword,
    submitSignUp,
  };
};
