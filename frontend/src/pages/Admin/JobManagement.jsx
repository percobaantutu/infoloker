import React from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { useAdminJobs } from "../../hooks/admin/useAdminJobs";
import { Search, Trash2, Star, Plus } from "lucide-react";
import LoadingSpinner from "../../components/layout/LoadingSpinner";
import moment from "moment";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";

const JobManagement = () => {
  const { 
    jobs, isLoading, pagination, filters, setFilters, 
    deleteJob, toggleFeature, handlePageChange 
  } = useAdminJobs();

  if (isLoading && pagination.currentPage === 1 && jobs.length === 0) return <LoadingSpinner />;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
            <p className="text-sm text-gray-500 mt-1">Total Jobs: {pagination.totalJobs}</p>
          </div>
          <Link
            to="/admin/jobs/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Job
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
            className="px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Table using UI Components */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-4">Job Title</TableHead>
                <TableHead className="px-6 py-4">Company</TableHead>
                <TableHead className="px-6 py-4">Status</TableHead>
                <TableHead className="px-6 py-4">Posted</TableHead>
                <TableHead className="px-6 py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <TableRow key={job._id} className="hover:bg-gray-50">
                    <TableCell className="px-6 py-4 font-medium text-gray-900">
                      {job.title}
                      {job.isFeatured && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600">
                      {job.isAdminPosted ? (
                        <span className="flex items-center gap-1.5">
                          {job.adminCompanyName}
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700 border border-red-200">Admin</span>
                        </span>
                      ) : (
                        job.company?.companyName || job.company?.name || "Unknown"
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        !job.isClosed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {!job.isClosed ? "Active" : "Closed"}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-500">
                      {moment(job.createdAt).format("MMM D, YYYY")}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => toggleFeature(job._id)}
                          className={`p-2 rounded-lg transition-colors ${
                            job.isFeatured ? "text-yellow-500 bg-yellow-50" : "text-gray-400 hover:bg-gray-100"
                          }`}
                          title={job.isFeatured ? "Remove Feature" : "Feature Job"}
                        >
                          <Star className={`w-4 h-4 ${job.isFeatured ? "fill-current" : ""}`} />
                        </button>
                        <button 
                          onClick={() => deleteJob(job._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No jobs found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex justify-center gap-2">
                <button
                    disabled={pagination.currentPage === 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="px-3 py-1 text-sm text-gray-600 self-center">
                    Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default JobManagement;