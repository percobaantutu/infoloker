import React from "react";
import { Plus, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../Card";

// 1. Move static data OUTSIDE the component to prevent re-creation on every render
const QUICK_ACTIONS = [
  {
    title: "Post New Job",
    icon: Plus,
    color: "bg-blue-50 text-blue-700",
    path: "/post-job",
  },
  {
    title: "Review Applications",
    icon: Users,
    color: "bg-green-50 text-green-700",
    path: "/manage-jobs",
  },
  {
    title: "Company Settings",
    icon: Building2,
    color: "bg-orange-50 text-orange-700",
    path: "/company-profile",
  },
];

const QuickActions = () => {
  // 2. Define the navigate function
  const navigate = useNavigate();

  return (
    <Card title="Quick Actions" subtitle="Common tasks to get you started">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK_ACTIONS.map((action, index) => (
          <button
            key={index} // Using index is okay for static lists, but unique IDs are better if data changes
            onClick={() => navigate(action.path)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
          >
            <div className={`p-2 rounded-lg ${action.color}`}>
              {/* This works because action.icon is a reference to a Component */}
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-800">{action.title}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;
