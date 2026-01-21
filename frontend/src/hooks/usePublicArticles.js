import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const usePublicArticles = () => {
  const [articles, setArticles] = useState([]);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalArticles: 0
  });

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    page: 1
  });

  // 1. Fetch List of Articles
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.category && filters.category !== "All") params.append("category", filters.category);
      params.append("page", filters.page);
      params.append("status", "published"); // Force published only

      const response = await axiosInstance.get(`${API_PATHS.ARTICLES.GET_ALL}?${params.toString()}`);
      
      setArticles(response.data.articles);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalArticles: response.data.totalArticles
      });
    } catch (err) {
      console.error("Fetch Articles Error:", err);
      setError("Failed to load articles.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // 2. Fetch Single Article by Slug
  const fetchArticleBySlug = useCallback(async (slug) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.ARTICLES.GET_BY_SLUG(slug));
      setCurrentArticle(response.data);
    } catch (err) {
      console.error("Fetch Article Error:", err);
      setError("Article not found.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger fetch when filters change
  useEffect(() => {
    
  }, []);

  return {
    articles,
    currentArticle,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    fetchArticles,
    fetchArticleBySlug
  };
};