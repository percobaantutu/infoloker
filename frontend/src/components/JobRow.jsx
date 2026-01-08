import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Users, Plus, X, Loader } from "lucide-react";

const JobRow = ({ job, onStatusToggle, onDelete, actionLoading }) => {
  const navigate = useNavigate();

  // Check if THIS specific job is doing an action
  const isToggling = actionLoading[job.id] === "status";
  const isDeleting = actionLoading[job.id] === "delete";
  const isBusy = isToggling || isDeleting;

  return (
    <tr className={`hover:bg-blue-50/30 transition-all duration-200 border-b border-gray-200 ${isBusy ? "opacity-50" : ""}`}>
      <td className="px-6 py-4 whitespace-nowrap min-w-[200px] sm:min-w-0">
        <div>
          <div className="text-sm font-semibold text-gray-900">{job.title}</div>
          <div className="text-xs text-gray-500 font-medium">{job.company}</div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap min-w-[120px] sm:min-w-0">
        <span
          className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-full 
          ${job.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
        >
          {job.status}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap min-w-[130px] sm:min-w-0">
        <button
          disabled={isBusy}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:bg-blue-50 px-2 py-1 rounded-lg disabled:opacity-50"
          onClick={() => navigate(`/applicants/${job.id}`)}
        >
          <Users className="w-4 h-4 mr-1.5" />
          {job.applicants}
        </button>
      </td>

      <td className="px-6 py-4 whitespace-nowrap min-w-[130px] sm:min-w-0">
        <div className="flex space-x-2">
          {/* Edit */}
          <button disabled={isBusy} className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50" onClick={() => navigate(`/edit-job/${job.id}`)}>
            <Edit className="w-4 h-4" />
          </button>

          {/* Status Toggle */}
          <button
            disabled={isBusy}
            onClick={() => onStatusToggle(job.id)}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors disabled:opacity-50 min-w-[90px] justify-center
              ${job.status === "Active" ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
          >
            {isToggling ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {job.status === "Active" ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span className="hidden sm:inline">{job.status === "Active" ? "Close" : "Open"}</span>
              </>
            )}
          </button>

          {/* Delete */}
          <button disabled={isBusy} onClick={() => onDelete(job.id)} className="flex items-center gap-2 text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50">
            {isDeleting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default JobRow;
