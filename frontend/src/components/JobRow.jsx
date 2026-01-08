import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Users, Plus, X } from "lucide-react";

const JobRow = ({ job, onStatusToggle, onDelete }) => {
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-blue-50/30 transition-all duration-200 border-b border-gray-200">
      {/* Title & Company */}
      <td className="px-6 py-4 whitespace-nowrap min-w-[200px] sm:min-w-0">
        <div>
          <div className="text-sm font-semibold text-gray-900">{job.title}</div>
          <div className="text-xs text-gray-500 font-medium">{job.company}</div>
        </div>
      </td>

      {/* Status Badge */}
      <td className="px-6 py-4 whitespace-nowrap min-w-[120px] sm:min-w-0">
        <span
          className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-full 
          ${job.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
        >
          {job.status}
        </span>
      </td>

      {/* Applicant Count */}
      <td className="px-6 py-4 whitespace-nowrap min-w-[130px] sm:min-w-0">
        <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:bg-blue-50 px-2 py-1 rounded-lg" onClick={() => navigate(`/applicants/${job.id}`)}>
          <Users className="w-4 h-4 mr-1.5" />
          {job.applicants}
        </button>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap min-w-[130px] sm:min-w-0">
        <div className="flex space-x-2">
          {/* Edit Button - FIXED ROUTING */}
          <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors" onClick={() => navigate(`/edit-job/${job.id}`)}>
            <Edit className="w-4 h-4" />
          </button>

          {/* Status Toggle */}
          <button
            onClick={() => onStatusToggle(job.id)}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors
              ${job.status === "Active" ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
          >
            {job.status === "Active" ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span className="hidden sm:inline">{job.status === "Active" ? "Close" : "Activate"}</span>
          </button>

          {/* Delete Button */}
          <button onClick={() => onDelete(job.id)} className="flex items-center gap-2 text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default JobRow;
