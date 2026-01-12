import React from "react";
import { Building2, Calendar, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const getStatusColor = (status) => {
  switch (status) {
    case "Accepted": return "bg-green-100 text-green-700 border-green-200";
    case "Rejected": return "bg-red-50 text-red-700 border-red-200";
    case "Interview": return "bg-purple-100 text-purple-700 border-purple-200";
    case "In Review": return "bg-blue-100 text-blue-700 border-blue-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const ApplicationCard = ({ application }) => {
  const navigate = useNavigate();
  const { job, status, createdAt } = application;

  // Handle case where job might be deleted but application remains
  if (!job) return null; 

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      
      {/* Header: Company & Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 overflow-hidden">
            {job.company?.companyLogo ? (
              <img src={job.company.companyLogo} alt={job.company.companyName} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 line-clamp-1">{job.title}</h4>
            <p className="text-sm text-gray-500">{job.company?.companyName || "Company"}</p>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-6 flex-1">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          {job.location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          Applied {moment(createdAt).fromNow()}
        </div>
      </div>

      {/* Footer: Action */}
      <button 
        onClick={() => navigate(`/job/${job._id}`)}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
      >
        View Job Details
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
};

export default ApplicationCard;