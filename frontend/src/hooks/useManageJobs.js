import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import { toggleJobStatus, deleteJob, getJobsEmployer } from "../utils/jobService";

export const useManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Sort State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. Fetch Jobs
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getJobsEmployer();
      if (data) {
        // Normalize data structure
        const formatted = data.map((job) => ({
          id: job._id,
          title: job.title,
          company: job.company?.name || "Unknown",
          status: job.isClosed ? "Closed" : "Active",
          applicants: job.applicationsCount || 0,
          datePosted: moment(job.createdAt).format("YYYY-MM-DD"),
          isClosed: job.isClosed,
        }));
        setJobs(formatted);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // 2. Critical Fix: Reset Pagination on Filter Change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // 3. Filtering & Sorting Logic
  const filteredAndSortedJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle numeric sorting for applicants
      if (sortField === "applicants") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [jobs, searchTerm, statusFilter, sortField, sortDirection]);

  // 4. Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);
  const paginatedJobs = filteredAndSortedJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 5. Actions
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleStatusToggle = async (jobId) => {
    // Optimistic Update
    const originalJobs = [...jobs];
    setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: job.status === "Active" ? "Closed" : "Active" } : job)));

    try {
      await toggleJobStatus(jobId);
      toast.success("Job status updated");
    } catch (error) {
      setJobs(originalJobs); // Revert on fail
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (jobId) => {
    // Critical Fix: Confirmation
    if (!window.confirm("Are you sure you want to delete this job? This cannot be undone.")) return;

    // Optimistic Update
    const originalJobs = [...jobs];
    setJobs((prev) => prev.filter((job) => job.id !== jobId));

    try {
      await deleteJob(jobId);
      toast.success("Job deleted successfully");
    } catch (error) {
      setJobs(originalJobs);
      toast.error("Failed to delete job");
    }
  };

  return {
    // Data
    jobs: paginatedJobs,
    totalJobs: filteredAndSortedJobs.length,
    isLoading,

    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,

    // Filters & Sort
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDirection,
    handleSort,

    // Actions
    handleStatusToggle,
    handleDelete,
  };
};
