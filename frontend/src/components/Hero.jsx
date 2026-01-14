import { motion, scale } from "framer-motion";
import { User, Search, ArrowRight, Building2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const stats = [
    { icon: User, label: "Active Users", value: "1,200+" },
    { icon: Building2, label: "Companies", value: "300+" },
    { icon: TrendingUp, label: "Jobs Posted", value: "5,000+" },
  ];
  return (
    <section className="pt-20 pb-16 bg-gray-50 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 loading-tight pt-10">
            Discover Your Dream Job with <span className="block bg-gradient-to-r from-blue-600 to-gray-900 bg-clip-text text-transparent mt-2">infoloker</span>
          </motion.h1>
          {/* Sub Heading */}
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl md:text-xl text-gray-600 mb-12 leading-tigt mx-auto">
            Join thousands of job seekers and employers connecting daily. Find the perfect match for your career goals.
          </motion.p>
          {/* CTA Button */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/find-jobs")}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-blue-600 to-gray-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 cursor-pointer"
            >
              <Search className="w-5 h-5" /> Find Jobs Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transfrom" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(isAuthenticated && user?.role === "employer" ? "/employer-dashboard" : "/login")}
              className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
            >
              Post a Job
            </motion.button>
          </motion.div>
          {/* Stats Section */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center space-y-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center ">
                  <stat.icon className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800">{stat.value}</h3>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform translate-x-1/2 translate-y-1/2   w-96 h-96 bg-purple-200  blur-3xl opacity-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full "></div>
      </div>
    </section>
  );
};
export default Hero;
