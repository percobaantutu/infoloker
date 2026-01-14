import React, { useState } from "react";
import { Briefcase, Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./layout/ProfileDropdown";
import NotificationDropdown from "./layout/NotificationDropdown";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

   const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 h-16">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* 1. Logo (Left) */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-gray-900 p-2 rounded-lg flex mr-2 items-center justify-center shadow-md">
              <Briefcase className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">infoloker</span>
          </div>

          {/* 2. Desktop Navigation (Right) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/find-jobs" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Find Jobs
            </Link>
            
            {/* If logged in, show Profile Dropdown. If not, show Login/Signup */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
           
                <NotificationDropdown />
                
              
                <ProfileDropdown />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">
                  Login
                </Link>
                <Link to="/signup" className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* 3. Mobile Hamburger (Right) */}
          <div className="md:hidden flex items-center space-x-2">
            <NotificationDropdown />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col space-y-4 animate-in slide-in-from-top-5">
          <Link 
            to="/find-jobs" 
            className="text-base font-medium text-gray-700 py-2 border-b border-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Find Jobs
          </Link>

          {isAuthenticated ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-50">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {user?.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover"/> : user?.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              {user.role === 'employer' ? (
                 <Link to="/employer-dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 py-2">Dashboard</Link>
              ) : (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 py-2">My Profile</Link>
                  <Link to="/applications/my" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 py-2">My Applications</Link>
                  <Link to="/saved-jobs" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 py-2">Saved Jobs</Link>
                   <button onClick={handleLogout} className="w-full text-center py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col space-y-3 pt-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium">
                Login
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 bg-blue-600 text-white rounded-lg font-medium">
                Sign Up
              </Link>
              
               
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;