import { useState, useMemo, useEffect } from "react";
import { Search, Plus, Edit, X, Trash2, ChevronDown, ChevronUp, Users } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "../../components/ui/pagination";
import PaginationComponent from "../../components/PaginationComponent";

const ManageJobs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;
  const [jobs, setJobs] = useState([]);

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "applicants") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [jobs, searchTerm, statusFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredAndSortedJobs.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleStatusChange = async (jobId) => {
    try {
      const response = await axiosInstance.put(API_PATHS.JOBS.TOGGLE_CLOSE(jobId));
      getPostedJobs(true);
    } catch (error) {
      toast.error("Failed to update job status.");
      console.error("Error updating job status:", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(jobId));
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (error) {
      toast.error("Failed to delete job.");
      console.error("Error deleting job:", error);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 text-gray-400" />;
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />;
  };

  const LoadingRow = () => {
    return (
      <tr className="animate-pulse">
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </td>
        <td className="px-6 py-4">
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded w-15"></div>
            <div className="h-8 bg-gray-200 rounded w-15"></div>
            <div className="h-8 bg-gray-200 rounded w-15"></div>
          </div>
        </td>
      </tr>
    );
  };
  const getPostedJobs = async (disabledLoader) => {
    setIsLoading(!disabledLoader);
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);
      if (response.status === 200 && response.data?.length > 0) {
        const formattedJobs = response.data?.map((job) => ({
          id: job._id,
          title: job.title,
          company: job?.company?.name,
          status: job.isClosed ? "Closed" : "Active",
          applicants: job?.applicationsCount || 0,
          datePosted: moment(job?.createdAt).format("YYYY-MM-DD"),
          logo: job?.company?.companyLogo,
        }));
        setJobs(formattedJobs);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to fetch jobs.");
        console.error(error.response.data.message);
      } else {
        console.error("Error fetching jobs:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostedJobs();
    return () => {};
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-row items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Job Management</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your job postings and track applications</p>
              </div>

              <button
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => navigate("/post-job")}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Job
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl shadow-black/5 border border-gray-200 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>

                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500/20 focus:ring-blue-500 focus:ring-2 outline-0 transition-all duration-200 bg-gray-50 placeholder-gray-400"
                />
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500/20 focus:ring-blue-500 focus:ring-2 outline-0 transition-all duration-200 bg-gray-50"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Result Count */}
            <div className="my-4">
              <p className="text-sm text-gray-600">
                Showing {paginatedJobs.length} of {filteredAndSortedJobs.length} jobs
              </p>
            </div>

            {/* Empty State OR Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
              {filteredAndSortedJobs.length === 0 && !isLoading ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                  <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="w-[75vw] md:w-full  bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 srollbar-track-gray-100">
                  <Table className="min-w-full divide-y divide-gray-200">
                    <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                      <TableRow>
                        <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("title")}>
                          {" "}
                          <div className="flex items-center space-x-1">
                            <span>Job Title</span>
                            <SortIcon field="title" />
                          </div>
                        </TableHead>
                        <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider  cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("status")}>
                          {" "}
                          <div className="flex items-center space-x-1">
                            <span>Status</span>
                            <SortIcon field="status" />
                          </div>
                        </TableHead>
                        <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("applicants")}>
                          {" "}
                          <div className="flex items-center space-x-1">
                            <span>Applicants</span>
                            <SortIcon field="applicants" />
                          </div>
                        </TableHead>
                        <TableHead className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white divide-y divide-gray-200">
                      {isLoading
                        ? Array.from({ length: 5 }).map((_, index) => <LoadingRow key={index} />)
                        : paginatedJobs.map((job) => (
                            <TableRow key={job.id} className="hover:bg-blue-50/30 transition-all duration-200 border-b border-gray-200">
                              <TableCell className="px-6 py-4 whitespace-nowrap min-w-[200px] sm:min-w-0">
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{job.title}</div>
                                  <div className="text-xs text-gray-500 font-medium">{job.company}</div>
                                </div>
                              </TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap min-w-[120px] sm:min-w-0">
                                <span className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-full ${job.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{job.status}</span>
                              </TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap min-w-[130px] sm:min-w-0">
                                <button
                                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:bg-blue-50 px-2 py-1 rounded-lg "
                                  onClick={() =>
                                    navigate("/applicants", {
                                      state: { jobId: job.id },
                                    })
                                  }
                                >
                                  <Users className="w-4 h-4 mr-1.5" />
                                  {job.applicants}
                                </button>
                              </TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap min-w-[130px] sm:min-w-0">
                                <div className="flex space-x-2">
                                  <button
                                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                    onClick={() =>
                                      navigate("/post-job", {
                                        state: { jobId: job.id },
                                      })
                                    }
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  {job.status === "Active" ? (
                                    <button className="flex items-center gap-2 text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200" onClick={() => handleStatusChange(job.id)}>
                                      <X className="w-4 h-4" />
                                      <span className="hidden sm:inline">Close</span>
                                    </button>
                                  ) : (
                                    <button onClick={() => handleStatusChange(job.id)} className="flex items-center gap-2 text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200">
                                      <Plus className="w-4 h-4" />
                                      <span className="hidden sm:inline">Activate</span>
                                    </button>
                                  )}
                                  <button onClick={() => handleDeleteJob(job.id)} className="flex items-center gap-2 text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200">
                                    <Trash2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Delete</span>
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                  <div>{!isLoading && filteredAndSortedJobs.length > 0 && <PaginationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageJobs;
