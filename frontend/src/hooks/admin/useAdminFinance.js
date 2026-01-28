import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

export const useAdminFinance = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalActiveSubs: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    status: "All",
    search: "",
    page: 1
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status !== "All") params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      params.append("page", filters.page);

      const [subRes, statsRes] = await Promise.all([
        axiosInstance.get(`${API_PATHS.ADMIN.SUBSCRIPTIONS}?${params.toString()}`),
        axiosInstance.get(API_PATHS.ADMIN.REVENUE)
      ]);

      setSubscriptions(subRes.data.subscriptions);
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load finance data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.status, filters.page, filters.search]); 

  return { 
    subscriptions, 
    stats, 
    isLoading, 
    filters, 
    setFilters 
  };
};