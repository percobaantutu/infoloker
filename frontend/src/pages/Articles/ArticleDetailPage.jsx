import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import parse from "html-react-parser"; 
import moment from "moment";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2 } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LoadingSpinner from "../../components/layout/LoadingSpinner";
import { usePublicArticles } from "../../hooks/usePublicArticles";

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentArticle, loading, error, fetchArticleBySlug } = usePublicArticles();

  useEffect(() => {
    if (slug) {
      fetchArticleBySlug(slug);
    }
  }, [slug]);

  if (loading) return <LoadingSpinner />;

  if (error || !currentArticle) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
            <p className="text-gray-500 mb-6">The article you are looking for does not exist.</p>
            <button 
              onClick={() => navigate("/articles")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Blog
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <div className="relative h-[400px] w-full bg-gray-900">
          {/* Background Image with Overlay */}
          {currentArticle.coverImage && (
            <>
              <img 
                src={currentArticle.coverImage} 
                alt={currentArticle.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            </>
          )}

          {/* Content Wrapper */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl w-full px-6 pt-20 text-center">
              
              {/* Category Badge */}
              <span className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-600/90 text-white text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
                {currentArticle.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-white font-display leading-tight mb-6 drop-shadow-md">
                {currentArticle.title}
              </h1>

              {/* Meta Data */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-200 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {currentArticle.author?.avatar ? (
                      <img src={currentArticle.author.avatar} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <span>{currentArticle.author?.name}</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {moment(currentArticle.publishedAt).format("MMMM Do, YYYY")}
                </div>

                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {currentArticle.readTime} min read
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 2. Content Container */}
        <div className="max-w-3xl mx-auto px-6 -mt-16 relative z-10 pb-20">
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            
            {/* Article Body */}
            <article className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed font-body">
              {parse(currentArticle.content)}
            </article>

            {/* Tags & Share */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {currentArticle.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-sm hover:bg-gray-100 transition-colors cursor-default">
                    <Tag className="w-3 h-3 mr-2 text-gray-400" />
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Share (Mock) */}
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium">
                <Share2 className="w-4 h-4" />
                Share Article
              </button>

            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link 
              to="/articles" 
              className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetailPage;