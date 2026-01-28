import { Crown, Calendar, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubscriptionStatus = ({ user }) => {
  const navigate = useNavigate();
  const isPremium = user?.plan && user?.plan !== "free";

  return (
    <div className={`p-6 rounded-2xl border ${isPremium ? "bg-gradient-to-br from-indigo-900 to-blue-900 text-white border-transparent" : "bg-white border-gray-200"}`}>
      
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isPremium ? "bg-white/10" : "bg-gray-100 text-gray-600"}`}>
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isPremium ? "text-white" : "text-gray-900"}`}>
              {user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : "Free"} Plan
            </h3>
            <p className={`text-sm ${isPremium ? "text-blue-100" : "text-gray-500"}`}>
              {isPremium ? "Active Subscription" : "Upgrade to unlock features"}
            </p>
          </div>
        </div>

        {!isPremium && (
          <button 
            onClick={() => navigate("/pricing")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Upgrade
          </button>
        )}
      </div>


      <div className={`mt-4 pt-4 border-t ${isPremium ? "border-white/10" : "border-gray-100"}`}>
         <div className="flex items-center justify-between text-sm mb-1">
            <span className={isPremium ? "text-blue-100" : "text-gray-600"}>Job Postings</span>
            <span className={`font-medium ${isPremium ? "text-white" : "text-gray-900"}`}>
                {isPremium ? "Unlimited" : "1 Max"}
            </span>
         </div>

         {!isPremium && (
             <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
     
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '100%' }}></div> 
             </div>
         )}
      </div>

    </div>
  );
};

export default SubscriptionStatus;