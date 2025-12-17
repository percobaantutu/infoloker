import { useState, useEffect } from "react";
import { Briefcase, Building2, LogOut, Menu, X, User as UserIcon, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NAVIGATION_MENU } from "../../utils/data";
import NavigationItem from "./NavigationItem";
import ProfileDropdown from "./ProfileDropdown";

const DashboardLayout = ({ activeMenu, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu || "employer-dashboard");

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
            {!isCollapsed && <span className="text-xl font-bold text-gray-900">infoloker</span>}
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
      <div className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ${!isMobile && (isCollapsed ? "ml-20" : "ml-64")}`}>
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
          <ProfileDropdown profileRoute={user?.role === "Employer" ? "/company-profile" : "/profile"} showRole={true} />
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
