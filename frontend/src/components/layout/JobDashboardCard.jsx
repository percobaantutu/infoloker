import React from "react";
import { Briefcase } from "lucide-react";
import moment from "moment";

const JobDashboardCard = ({ job }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      {/* Left Side: Icon and Info */}
      <div className="flex items-center space-x-4">
        {/* Icon Container */}
        <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-blue-600" />
        </div>

        {/* Text Details */}
        <div>
          <h4 className="font-medium text-[15px] text-gray-900">{job.title}</h4>
          <p className="text-xs text-gray-500 ">
            {job.location} • {moment(job.createdAt)?.format("Do MM YYYY")}
          </p>
        </div>
      </div>

      {/* Right Side: Status Badge */}
      <div className="flex items-center space-x-3">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${!job.isClosed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{job.isClosed ? "Closed" : "Active"}</span>
      </div>
    </div>
  );
};

export default JobDashboardCard;
