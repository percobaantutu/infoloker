import React, { useEffect } from "react";
import { Search, PenTool } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import LoadingSpinner from "../../components/layout/LoadingSpinner";
import { usePublicArticles } from "../../hooks/usePublicArticles";
import { ARTICLE_CATEGORIES } from "../../utils/data";
import { useDebounce } from "../../hooks/useDebounce";
import ArticleCard from "../../components/articles/ArticleCard";

const ArticlesPage = () => {
  const { t } = useTranslation();
  const { 
    articles, 
    loading, 
    filters, 
    setFilters, 
    fetchArticles,
    pagination 
  } = usePublicArticles();

  // Debounce search to prevent API spam
  const debouncedSearch = useDebounce(filters.search, 500);

  // Re-fetch when filters change (search or category)
  useEffect(() => {
    fetchArticles();
  }, [debouncedSearch, filters.category, filters.page]); // Depend on debounced value

  // Handle Search Input
  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  // Handle Category Click
  const handleCategoryChange = (catValue) => {
    setFilters(prev => ({ ...prev, category: catValue, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        
        {/* 1. Hero / Header Section */}
        <div className="bg-white border-b border-gray-100 pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wide uppercase">
              <PenTool className="w-3 h-3 mr-2" />
              {t('articles.careerBlog', 'Career Blog')}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-display">
              {t('articles.pageTitle', 'Insights for your career journey')}
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {t('articles.pageSubtitle', 'Expert advice, industry trends, and tips to help you land your dream job and succeed in your career.')}
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mt-8 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('articles.searchPlaceholder', 'Search articles...')}
                value={filters.search}
                onChange={handleSearchChange}
                className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* 2. Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => handleCategoryChange("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !filters.category 
                  ? "bg-gray-900 text-white shadow-lg" 
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {t('articles.allPosts', 'All Posts')}
            </button>
            {ARTICLE_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.category === cat.value 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {t(`articleCategories.${cat.value}`, cat.label)}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          {loading ? (
             <div className="flex justify-center py-20">
                <LoadingSpinner />
             </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t('articles.noArticles', 'No articles found')}</h3>
              <p className="text-gray-500">{t('articles.adjustFilters', 'Try adjusting your search or category filter.')}</p>
            </div>
          )}

          {/* Simple Pagination */}
          {pagination.totalPages > 1 && (
             <div className="mt-12 flex justify-center gap-2">
                <button 
                  disabled={pagination.currentPage === 1}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
                >
                  {t('common.previous', 'Previous')}
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  {t('articles.pageOf', 'Page {{current}} of {{total}}', { current: pagination.currentPage, total: pagination.totalPages })}
                </span>
                <button 
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
                >
                  {t('common.next', 'Next')}
                </button>
             </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlesPage;