import React from "react";
import { Search } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/layout/LoadingSpinner";
import AllApplicantsTable from "../../components/AllApplicantsTable";
import { useAllApplicants } from "../../hooks/useAllApplicants";

const AllApplicants = () => {
  const { applications, totalApplications, isLoading, updatingStatusId, searchTerm, setSearchTerm, statusFilter, setStatusFilter, updateStatus } = useAllApplicants();

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="manage-jobs">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="manage-jobs">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Applications</h1>
            <p className="text-gray-500 mt-1">Total Applications: {totalApplications}</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by candidate or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="All">All Statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="In Review">In Review</option>
                  <option value="Interview">Interview</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <AllApplicantsTable applications={applications} updatingStatusId={updatingStatusId} onStatusUpdate={updateStatus} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AllApplicants;
