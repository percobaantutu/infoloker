import { useNavigate } from "react-router-dom";
import { Plus, Briefcase } from "lucide-react"; // Import Briefcase icon
import DashboardLayout from "../../components/layout/DashboardLayout";
import PaginationComponent from "../../components/PaginationComponent";
import JobFilters from "../../components/JobFilters";
import JobsTable from "../../components/JobsTable";
import { useManageJobs } from "../../hooks/useManageJobs";

const ManageJobs = () => {
  const navigate = useNavigate();
  const {
    jobs,
    isLoading,
    actionLoading, // Get this
    totalJobsUnfiltered, // Get this for empty state check
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDirection,
    handleSort,
    handleStatusToggle,
    handleDelete,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useManageJobs();

  // 1. True Empty State: User has NEVER posted a job
  if (!isLoading && totalJobsUnfiltered === 0) {
    return (
      <DashboardLayout activeMenu="manage-jobs">
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No jobs posted yet</h2>
            <p className="text-gray-500 mb-6">Get started by creating your first job posting to find great talent.</p>
            <button onClick={() => navigate("/post-job")} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5">
              Post Your First Job
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="manage-jobs">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-row items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Job Management</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your job postings and track applications</p>
            </div>
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors" onClick={() => navigate("/post-job")}>
              <Plus className="w-5 h-5 mr-2" />
              Add New Job
            </button>
          </div>

          <JobFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

          {/* Table (Pass actionLoading down) */}
          <JobsTable jobs={jobs} isLoading={isLoading} actionLoading={actionLoading} sortField={sortField} sortDirection={sortDirection} onSort={handleSort} onStatusToggle={handleStatusToggle} onDelete={handleDelete} />

          {!isLoading && jobs.length > 0 && (
            <div className="mt-6">
              <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageJobs;
