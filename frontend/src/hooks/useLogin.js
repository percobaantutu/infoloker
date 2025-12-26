import { useState } from "react";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
    showPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors on type
    if (status.error) setStatus((prev) => ({ ...prev, error: null }));
  };

  const togglePassword = () => {
    setStatus((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const validate = () => {
    const emailError = validateEmail(formData.email);
    if (emailError) return emailError;
    if (!formData.password) return "Password is required";
    return null;
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setStatus((prev) => ({ ...prev, error: validationError }));
      return;
    }

    setStatus((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);
      const { token, role } = response.data; // Ensure your backend sends 'role' in top level or inside user object

      // Login Context
      login(response.data, token);

      setStatus((prev) => ({ ...prev, loading: false, success: true }));

      // Redirect logic (Use the role from response, NOT state)
      setTimeout(() => {
        // We use window.location.href to ensure a hard refresh if needed,
        // or navigate() for SPA feel. navigate is usually better.
        const target = role === "employer" ? "/employer-dashboard" : "/find-jobs";
        // navigate(target); // Uncomment if you prefer SPA navigation
        window.location.href = target;
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed. Please check your credentials.";
      setStatus((prev) => ({ ...prev, loading: false, error: msg }));
    }
  };

  return {
    formData,
    status,
    handleChange,
    togglePassword,
    submitLogin,
  };
};
