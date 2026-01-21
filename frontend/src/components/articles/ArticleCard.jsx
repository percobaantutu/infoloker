
import { Link } from "react-router-dom";
import { Clock, Calendar, User } from "lucide-react";
import moment from "moment";

const ArticleCard = ({ article }) => {
  return (
    <Link 
      to={`/articles/${article.slug}`} 
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full"
    >
      {/* Cover Image */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {article.coverImage ? (
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-4xl font-bold opacity-20">IMG</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-blue-700 rounded-full shadow-sm">
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors font-display">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Footer Info */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
          
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {article.author?.avatar ? (
                <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover"/>
              ) : (
                <User className="w-3 h-3 text-gray-400" />
              )}
            </div>
            <span className="font-medium text-gray-600 truncate max-w-[100px]">
              {article.author?.name || "Admin"}
            </span>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-3">
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {moment(article.publishedAt).format("MMM D")}
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {article.readTime || 5} min
            </span>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;