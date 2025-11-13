import React from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Header = () => {
  const isAuthenticated = true;
  const user = { fullName: "John Doe", role: "employer" };
  const navigate = useNavigate();

  return (
    <header>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg flex mr-1 items-center justify-center shadow-md">
              <Briefcase className="text-white w-6 h-6" />
            </div>

            <span className="text-xl md:text-2xl font-bold text-gray-800">infoloker</span>
          </div>
          {/* nav links. Hidden on mobile*/}
          <div className="hidden md:flex items-center space-x-8">
            <a onClick={() => navigate("/find-jobs")} className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
              Find Jobs
            </a>
            <a onClick={() => navigate(isAuthenticated && user?.role === "employer" ? "/employer-dashboard" : "/login")} className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
              For Employer
            </a>
          </div>
          {/* auth buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 ">Welcome {user?.fullName}</span>
                <Link
                  to={user?.role === "employer" ? "/employer-dashboard" : "/find-jobs"}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg front-medium hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-500">
                  Login
                </Link>
                <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg front-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
