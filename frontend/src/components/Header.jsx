import React, { useState } from "react";
import { Briefcase, Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./layout/ProfileDropdown";
import NotificationDropdown from "./layout/NotificationDropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const { t } = useTranslation();

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
            <div className="mr-2">
              <img src="/infoloker_logo.png" alt="Logo" className="w-8 h-8" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">infoloker</span>
          </div>

          {/* 2. Desktop Navigation (Right) */}
          <div className="hidden md:flex items-center space-x-6">
          {/* Show Find Jobs and Articles only for non-admin users */}
          {(!user || (user.role !== "employer" && user.role !== "admin")) && (
            <>
              <Link to="/find-jobs" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                {t('nav.findJobs')}
              </Link>
              <Link to="/articles" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                 {t('nav.articles', 'Articles')}
              </Link>
            </>
          )}
          
          {/* Show Admin Dashboard link for admin users */}
          {user?.role === "admin" && (
            <Link to="/admin/dashboard" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {t('nav.adminDashboard', 'Admin Dashboard')}
            </Link>
          )}
            
          
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <LanguageSwitcher />
           
                <NotificationDropdown />
                
              
                <ProfileDropdown />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <LanguageSwitcher />
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">
                  {t('nav.login')}
                </Link>
                <Link to="/signup" className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>

          {/* 3. Mobile Hamburger (Right) */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            {isAuthenticated && <NotificationDropdown />}
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
          {/* Show Find Jobs only for non-admin/non-employer users */}
          {(!user || (user.role !== "employer" && user.role !== "admin")) && (
            <Link 
              to="/find-jobs" 
              className="text-base font-medium text-gray-700 py-2 border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.findJobs')}
            </Link>
          )}

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
              
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 py-2">{t('nav.adminDashboard', 'Admin Dashboard')}</Link>
                  <button onClick={handleLogout} className="w-full text-center py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center">
                    <LogOut className="w-4 h-4 mr-2" /> {t('nav.logout')}
                  </button>
                </>
              ) : user.role === 'employer' ? (
                <>
                 <Link to="/employer-dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 py-2">{t('nav.dashboard')}</Link>
                 <Link to="/company-profile" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 py-2">{t('nav.companyProfile')}</Link>
                 <LanguageSwitcher />
                 <button onClick={handleLogout} className="w-full text-center py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center">
                <LogOut className="w-4 h-4 mr-2" /> {t('nav.logout')}
              </button>
              </>
              ) : (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 py-2">{t('nav.profile')}</Link>
                  <Link to="/applications/my" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 py-2">{t('nav.myApplications')}</Link>
                  <Link to="/saved-jobs" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 py-2">{t('nav.savedJobs')}</Link>
                  <LanguageSwitcher />
                   <button onClick={handleLogout} className="w-full text-center py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center">
                <LogOut className="w-4 h-4 mr-2" /> {t('nav.logout')}
              </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col space-y-3 pt-2">
       
              <Link 
                to="/articles" 
                onClick={() => setMobileMenuOpen(false)} 
                className="block text-gray-700 py-2 border-b border-gray-50 font-medium"
              >
                {t('nav.articles', 'Articles')}
              </Link>
              <div className="pt-2 space-y-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium block">
                  {t('nav.login')}
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 bg-blue-600 text-white rounded-lg font-medium block">
                  {t('nav.signup')}
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;