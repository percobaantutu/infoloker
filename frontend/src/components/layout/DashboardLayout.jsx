import { useState, useEffect } from "react";
import { Briefcase, Building2, LogOut, Menu, X, User as UserIcon, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NAVIGATION_MENU } from "../../utils/data";

// Extracted NavigationItem to keep code clean
const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
        isActive ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-50" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
      {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
    </button>
  );
};

const DashboardLayout = ({ activeMenu, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu || "employer-dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // Changed to 1024px for better tablet handling
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fixed variable name casing
  const isCollapsed = !isMobile && false; // You can make this dynamic state later

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 1. SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
          ${isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
          ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link className="flex items-center space-x-3" to="/">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white">
              <Briefcase size={20} />
            </div>
            {!isCollapsed && <span className="text-xl font-bold text-gray-900">JobPortal</span>}
          </Link>
          {/* Close button for mobile */}
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="ml-auto p-2 text-gray-500 hover:bg-gray-100 rounded-md">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-1">
          {NAVIGATION_MENU.map((item) => (
            <NavigationItem key={item.id} item={item} isActive={activeNavItem === item.id} onClick={handleNavigation} isCollapsed={isCollapsed} />
          ))}
        </div>

        {/* Sidebar Footer (Optional: Logout button at bottom) */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut className="h-5 w-5 mr-3" />
            {!isCollapsed && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${!isMobile && (isCollapsed ? "ml-20" : "ml-64")}`}>
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
          <div className="flex items-center">
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md">
                <Menu size={24} />
              </button>
            )}
            <h2 className="text-lg font-semibold text-gray-800 ml-2 capitalize">{activeNavItem.replace("-", " ")}</h2>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold border border-blue-200">{user?.name?.[0]?.toUpperCase() || <UserIcon size={18} />}</div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500">{user?.role || "Employer"}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setProfileDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-40">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <button onClick={() => navigate("/company-profile")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Profile Settings
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
