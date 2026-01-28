import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

export const useAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.DASHBOARD_OVERVIEW);
      setStats(response.data);
      setRecentUsers(response.data.recentUsers);
    } catch (error) {
      console.error("Admin Dashboard Error:", error);
      toast.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { stats, recentUsers, isLoading, refresh: fetchDashboardData };
};