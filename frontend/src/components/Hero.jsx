import { useState } from "react"; // Added useState
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // State for search inputs
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (location) params.append("location", location);
    navigate(`/find-jobs?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Geometric Blob Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#215E61] via-[#1a4b4e] to-[#233D4D]">
        {/* Animated Blobs */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Large Orange Blob - Top Right */}
          <motion.ellipse
            cx="1000"
            cy="100"
            rx="300"
            ry="250"
            fill="#FE7F2D"
            opacity="0.15"
            initial={{ scale: 1, x: 0, y: 0 }}
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 20, 0],
              y: [0, -10, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Medium Lime Blob - Left Center */}
          <motion.ellipse
            cx="100"
            cy="300"
            rx="200"
            ry="180"
            fill="#F5FBE6"
            opacity="0.08"
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.15, 1],
              x: [0, 15, 0],
              y: [0, 20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          
          {/* Small Orange Blob - Bottom Left */}
          <motion.circle
            cx="200"
            cy="500"
            r="120"
            fill="#FE7F2D"
            opacity="0.12"
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, -10, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          
          {/* Large Lime Blob - Top Left */}
          <motion.ellipse
            cx="300"
            cy="50"
            rx="250"
            ry="150"
            fill="#F5FBE6"
            opacity="0.06"
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.08, 1],
              y: [0, 15, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Medium Orange Blob - Right Center */}
          <motion.ellipse
            cx="1100"
            cy="400"
            rx="180"
            ry="220"
            fill="#FE7F2D"
            opacity="0.1"
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.12, 1],
              x: [0, -15, 0],
              y: [0, 10, 0],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          
          {/* Accent Lime Circle - Center */}
          <motion.circle
            cx="600"
            cy="300"
            r="80"
            fill="#F5FBE6"
            opacity="0.05"
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </svg>
        
        {/* Subtle Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #F5FBE6 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full max-w-5xl">
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }} 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-6 mb-6 tracking-tight"
          >
            {t('landing.hero.title', 'Find the job that fits your life')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }} 
            className="text-xl text-gray-200 max-w-2xl mx-auto font-light"
          >
            {t('landing.hero.subtitle', 'Thousands of jobs in the leading companies are waiting for you.')}
          </motion.p>
        </div>

        {/* Search Box - The Core "Tool" */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5, delay: 0.4 }} 
          className="bg-white p-4 rounded-2xl shadow-2xl mx-auto max-w-4xl"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Keyword Input */}
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('landing.hero.keywordPlaceholder', 'Job title, keywords, or company')}
                className="block w-full pl-10 pr-3 py-4 border-b md:border-b-0 md:border-r border-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 text-base font-medium"
              />
            </div>

            {/* Location Input */}
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('landing.hero.locationPlaceholder', 'City, state, or zip code')}
                className="block w-full pl-10 pr-3 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 text-base font-medium"
              />
            </div>

            {/* Search Button */}
            <Button 
                onClick={handleSearch}
                className="h-auto py-4 px-8 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
            >
              {t('landing.hero.searchButton', 'Search Jobs')}
            </Button>
          </div>
        </motion.div>

    
      </div>
    </section>
  );
};

export default Hero;
