import { ChevronDown, Loader } from "lucide-react";

const STATUS_OPTIONS = ["Applied", "In Review", "Interview", "Accepted", "Rejected"];

const getStatusColor = (status) => {
  switch (status) {
    case "Accepted":
      return "bg-green-100 text-green-700 border-green-200";
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200";
    case "Interview":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "In Review":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const StatusSelect = ({ currentStatus, onChange, isLoading }) => {
  return (
    <div className="relative inline-block w-40">
      {isLoading ? (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Updating...</span>
        </div>
      ) : (
        <div className="relative">
          <select
            value={currentStatus}
            onChange={(e) => onChange(e.target.value)}
            className={`appearance-none w-full pl-3 pr-8 py-1.5 text-xs font-semibold rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-all ${getStatusColor(
              currentStatus
            )}`}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status} className="bg-white text-gray-900">
                {status}
              </option>
            ))}
          </select>
          <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${currentStatus === "Rejected" ? "text-red-700" : "text-gray-500"}`} />
        </div>
      )}
    </div>
  );
};

export default StatusSelect;
