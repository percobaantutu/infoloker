
import { MapPin, Briefcase, Clock, Heart, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { formatRupiah } from "../../utils/formatRupiah";

const JobCard = ({ job, onToggleSave }) => {
  const navigate = useNavigate();


  const handleCardClick = () => {
    navigate(`/job/${job._id}`);
  };


  const handleSaveClick = (e) => {
    e.stopPropagation();
    onToggleSave(job._id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
    >
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
          {job.company?.companyLogo ? (
            <img src={job.company.companyLogo} alt={job.company.companyName} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-7 h-7 text-gray-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-sm text-gray-500 font-medium mb-2">{job.company?.companyName || "Unknown Company"}</p>
            </div>
            
            {/* Save Button */}
            <button
              onClick={handleSaveClick}
              className={`p-2 rounded-full transition-colors ${
                job.isSaved 
                  ? "bg-red-50 text-red-500" 
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              }`}
            >
              <Heart className={`w-5 h-5 ${job.isSaved ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
              <Briefcase className="w-3 h-3 mr-1" />
              {job.type}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700">
              <MapPin className="w-3 h-3 mr-1" />
              {job.location}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-green-50 text-green-700">
              <Clock className="w-3 h-3 mr-1" />
              {moment(job.createdAt).fromNow(true)}
            </span>
          </div>

          {/* Footer: Salary & Status */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <p className="text-sm font-bold text-gray-900">
              Rp {formatRupiah(String(job.salaryMin))} - {formatRupiah(String(job.salaryMax))}
            </p>
            
            {/* Show "Applied" Badge if applicable */}
            {job.applicationStatus && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                {job.applicationStatus}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;