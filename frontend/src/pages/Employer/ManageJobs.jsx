import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PaginationComponent from "../../components/PaginationComponent";

import { useManageJobs } from "../../hooks/useManageJobs";
import JobsTable from "../../components/JobsTable";
import JobFilters from "../../components/JobFilters";

const ManageJobs = () => {
  const navigate = useNavigate();
  const { jobs, isLoading, searchTerm, setSearchTerm, statusFilter, setStatusFilter, sortField, sortDirection, handleSort, handleStatusToggle, handleDelete, currentPage, setCurrentPage, totalPages } = useManageJobs();

  return (
    <DashboardLayout activeMenu="manage-jobs">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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

          {/* Filters */}
          <JobFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

          {/* Result Count */}
          <div className="my-4 text-sm text-gray-600">
            {/* Note: In a real pagination scenario, you'd want 'Total Results' from backend */}
            Showing results
          </div>

          {/* Table */}
          <JobsTable jobs={jobs} isLoading={isLoading} sortField={sortField} sortDirection={sortDirection} onSort={handleSort} onStatusToggle={handleStatusToggle} onDelete={handleDelete} />

          {/* Pagination */}
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
