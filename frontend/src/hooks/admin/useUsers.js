import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useDebounce } from "../useDebounce";
import toast from "react-hot-toast";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0
  });

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    role: "All",
    status: "All", // Active or Suspended
    page: 1
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (filters.role !== "All") params.append("role", filters.role);
      if (filters.status !== "All") params.append("status", filters.status);
      params.append("page", filters.page);

      const response = await axiosInstance.get(`${API_PATHS.ADMIN.USERS}?${params.toString()}`);
      
      setUsers(response.data.users);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalUsers: response.data.totalUsers
      });
    } catch (error) {
      console.error("Fetch Users Error:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch when filters change
  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, filters.role, filters.status, filters.page]);

  // Actions
  const toggleUserStatus = async (userId) => {
    // Optimistic Update
    const originalUsers = [...users];
    setUsers(users.map(u => u._id === userId ? { ...u, isActive: !u.isActive } : u));

    try {
      await axiosInstance.put(API_PATHS.ADMIN.USER_SUSPEND(userId));
      toast.success("User status updated");
    } catch (error) {
      setUsers(originalUsers);
      toast.error("Failed to update status");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure? This will permanently delete the user.")) return;

    try {
      await axiosInstance.delete(API_PATHS.ADMIN.USER_DELETE(userId));
      toast.success("User deleted");
      // Remove from list
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return {
    users,
    isLoading,
    pagination,
    filters,
    setFilters,
    toggleUserStatus,
    deleteUser,
    handlePageChange
  };
};