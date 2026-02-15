import { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { getCachedData, setCachedData } from "../utils/cacheUtils";
import toast from "react-hot-toast";

const CACHE_KEY_ARTICLES = "swr_articles";

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
  const hasRestoredCache = useRef(false);

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    page: 1
  });

  const isDefaultFilter = !filters.search && (!filters.category || filters.category === "All") && filters.page === 1;

  // Restore cached data on first mount
  useEffect(() => {
    if (hasRestoredCache.current) return;
    hasRestoredCache.current = true;

    const cached = getCachedData(CACHE_KEY_ARTICLES);
    if (cached?.data) {
      setArticles(cached.data.articles || []);
      if (cached.data.pagination) {
        setPagination(cached.data.pagination);
      }
      setLoading(false);
    }
  }, []);

  // 1. Fetch List of Articles
  const fetchArticles = useCallback(async () => {
    // Only show spinner if we have no articles to display
    if (articles.length === 0) {
      setLoading(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.category && filters.category !== "All") params.append("category", filters.category);
      params.append("page", filters.page);
      params.append("status", "published");

      const response = await axiosInstance.get(`${API_PATHS.ARTICLES.GET_ALL}?${params.toString()}`);
      
      setArticles(response.data.articles);
      const pag = {
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalArticles: response.data.totalArticles
      };
      setPagination(pag);

      // Cache only default (unfiltered, page 1) results
      if (isDefaultFilter) {
        setCachedData(CACHE_KEY_ARTICLES, { articles: response.data.articles, pagination: pag });
      }
    } catch (err) {
      console.error("Fetch Articles Error:", err);
      if (articles.length === 0) {
        setError("Failed to load articles.");
      } else {
        toast.error("Could not refresh articles. Showing cached data.");
      }
    } finally {
      setLoading(false);
    }
  }, [filters, isDefaultFilter]); // eslint-disable-line react-hooks/exhaustive-deps

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