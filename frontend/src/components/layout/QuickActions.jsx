import React from "react";
import { Plus, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../Card";
import { useTranslation } from "react-i18next";


const QUICK_ACTIONS = [
  {
    titleKey: "employer.postJob", 
    icon: Plus,
    color: "bg-blue-50 text-blue-700",
    path: "/post-job",
  },
  {
    titleKey: "employer.reviewApplications",  
    icon: Users,
    color: "bg-green-50 text-green-700",
    path: "/manage-jobs",
  },
  {
    titleKey: "employer.companySettings", 
    icon: Building2,
    color: "bg-orange-50 text-orange-700",
    path: "/company-profile",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card 
      title={t('employer.quickActions')} 
      subtitle={t('employer.quickActionsSubtitle')}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK_ACTIONS.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
          >
            <div className={`p-2 rounded-lg ${action.color}`}>
              <action.icon className="w-5 h-5" />
            </div>
          
            <span className="text-sm font-medium text-gray-800">{t(action.titleKey)}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;