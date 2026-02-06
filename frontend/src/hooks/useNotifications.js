import { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Check if user is authenticated by looking for token
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  // Get token and strip any surrounding quotes
  const getToken = () => {
    let token = localStorage.getItem("token");
    if (token) {
      // Remove surrounding quotes if present (e.g., "\"token\"" -> "token")
      token = token.replace(/^["']|["']$/g, '');
    }
    return token;
  };

  // Fetch initial notifications via REST API
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated()) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.NOTIFICATIONS.GET_ALL);
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Failed to fetch notifications", error);
      }
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Connect to SSE stream
  const connectSSE = useCallback(() => {
    if (!isAuthenticated()) return;

    const token = getToken();
    if (!token) return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Create SSE connection with auth token in URL (EventSource doesn't support headers)
    const sseUrl = `${BASE_URL}${API_PATHS.NOTIFICATIONS.STREAM}?token=${encodeURIComponent(token)}`;
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      // Fetch initial notifications on connect
      fetchNotifications();
    };

    // Listen for notification events
    eventSource.addEventListener("notification", (event) => {
      try {
        const notification = JSON.parse(event.data);
        
        // Add new notification to the top of the list
        setNotifications((prev) => [
          { ...notification, _id: Date.now().toString(), isRead: false },
          ...prev.slice(0, 19), // Keep max 20
        ]);
        setUnreadCount((prev) => prev + 1);
      } catch (error) {
        // Silent fail - don't expose errors to console
      }
    });

    eventSource.addEventListener("connected", () => {
      // Connection confirmed
    });

    eventSource.onerror = () => {
      eventSource.close();
      
      // Reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        if (isAuthenticated()) {
          connectSSE();
        }
      }, 5000);
    };
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    if (!isAuthenticated()) return;
    
    // Optimistic update
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await axiosInstance.put(API_PATHS.NOTIFICATIONS.MARK_READ);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Failed to mark read", error);
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    // Connect to SSE
    connectSSE();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectSSE]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAllAsRead,
    refresh: fetchNotifications,
  };
};

