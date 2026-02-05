import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { usePublicArticles } from '../hooks/usePublicArticles';
import ArticleCard from './articles/Articlecard';
import LoadingSpinner from './layout/LoadingSpinner';

const ArticlesSection = () => {
    const { t } = useTranslation();
    const { articles, loading, fetchArticles } = usePublicArticles();

    useEffect(() => {
        fetchArticles();
    }, []);

    // Get latest 3 articles
    const latestArticles = articles?.slice(0, 3) || [];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.articles.title', 'Career Advice & Insights')}
            </h2>
            <p className="text-gray-600 max-w-xl text-lg">
                {t('landing.articles.subtitle', 'Stay ahead of the curve with our latest articles on career growth and industry trends.')}
            </p>
          </div>
          <Link 
            to="/articles" 
            className="hidden md:flex items-center font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {t('landing.articles.viewAll', 'View all articles')} <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        {/* Articles Grid */}
        {loading ? (
            <div className="flex justify-center py-12">
                <LoadingSpinner />
            </div>
        ) : latestArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
                <div key={article._id} className="h-full">
                    <ArticleCard article={article} />
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-12 text-gray-500">
                {t('landing.articles.noArticles', 'No articles found.')}
            </div>
        )}

         <div className="mt-8 text-center md:hidden">
            <Link 
                to="/articles" 
                className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
                {t('landing.articles.viewAll', 'View all articles')} <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
