import { useState } from "react";
import { ChevronDown, User as UserIcon, LogOut, FileText, Heart, UserCircle, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button 
        onClick={() => setOpen(!open)} 
        className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border border-blue-200">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-blue-600 font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          )}
        </div>
        
        {/* Desktop only arrow */}
        <ChevronDown size={16} className="text-gray-400 hidden md:block" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            
            {/* User Header */}
            <div className="px-4 py-3 border-b border-gray-50 mb-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            {/* Menu Items based on Role */}
            <div className="space-y-1">
              {user.role === 'employer' ? (
                <>
                  <button onClick={() => handleNavigate("/employer-dashboard")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </button>
                  <button onClick={() => handleNavigate("/company-profile")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <UserCircle className="w-4 h-4 mr-2" /> Company Profile
                  </button>
                </>
              ) : (
                /* JOB SEEKER LINKS */
                <>
                  <button onClick={() => handleNavigate("/profile")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <UserCircle className="w-4 h-4 mr-2" /> My Profile
                  </button>
                  <button onClick={() => handleNavigate("/applications/my")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> My Applications
                  </button>
                  <button onClick={() => handleNavigate("/saved-jobs")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <Heart className="w-4 h-4 mr-2" /> Saved Jobs
                  </button>
                </>
              )}
            </div>

            <div className="border-t border-gray-50 mt-1 pt-1">
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;