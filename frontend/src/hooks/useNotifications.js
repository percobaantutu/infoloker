import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.NOTIFICATIONS.GET_ALL);
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    // Optimistic update
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await axiosInstance.put(API_PATHS.NOTIFICATIONS.MARK_READ);
    } catch (error) {
      console.error("Failed to mark read", error);
    }
  };

 
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAllAsRead,
    refresh: fetchNotifications,
  };
};