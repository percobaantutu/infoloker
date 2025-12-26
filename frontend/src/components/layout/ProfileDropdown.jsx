import { useState } from "react";
import { ChevronDown, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProfileDropdown = ({ profileRoute = "/company-profile", showRole = true }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <button onClick={() => setOpen(!open)} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border border-blue-200">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name || "Profile"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "";
              }}
            />
          ) : (
            <span className="text-blue-600 font-semibold">{user?.name?.[0]?.toUpperCase()}</span>
          )}
        </div>

        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">{user?.name || "User"}</p>
          {showRole && <p className="text-xs text-gray-500">{user?.role || "User"}</p>}
        </div>

        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Click outside */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-40">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>

            <button
              onClick={() => {
                setOpen(false);
                navigate(profileRoute);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Profile Settings
            </button>

            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
