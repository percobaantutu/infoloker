import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters State
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      // Fetch all articles for the admin table
      const response = await axiosInstance.get(API_PATHS.ADMIN.ARTICLES, {
        params: { limit: 100 } // Fetch enough for the list
      });
      
      // Handle response structure (depending on how backend sends it)
      // Based on controller: res.json({ articles, totalPages... })
      setArticles(response.data.articles || []);
    } catch (error) {
      console.error("Fetch Articles Error:", error);
      toast.error("Failed to load articles");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    
    // Optimistic update (Remove from UI immediately)
    const originalArticles = [...articles];
    setArticles(prev => prev.filter(a => a._id !== id));

    try {
      await axiosInstance.delete(API_PATHS.ADMIN.ARTICLE_OPERATIONS(id));
      toast.success("Article deleted");
    } catch (error) {
      // Revert if failed
      setArticles(originalArticles);
      toast.error("Failed to delete article");
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Client-side Filtering Logic
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || article.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return {
    articles: filteredArticles,
    isLoading,
    deleteArticle,
    searchTerm, 
    setSearchTerm,
    statusFilter, 
    setStatusFilter,
    refresh: fetchArticles
  };
};