import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import { getJobsEmployer, toggleJobStatus, deleteJob } from "../utils/jobService";
import { useDebounce } from "./useDebounce";
export const useManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getJobsEmployer();
      if (data) {
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

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  const filteredAndSortedJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === "applicants") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [jobs, debouncedSearchTerm, statusFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);
  const paginatedJobs = filteredAndSortedJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleStatusToggle = async (jobId) => {
    setActionLoading((prev) => ({ ...prev, [jobId]: "status" }));

    const originalJobs = [...jobs];
    setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: job.status === "Active" ? "Closed" : "Active" } : job)));

    try {
      await toggleJobStatus(jobId);
      toast.success("Job status updated");
    } catch (error) {
      setJobs(originalJobs);
      toast.error("Failed to update status");
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[jobId];
        return next;
      });
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    setActionLoading((prev) => ({ ...prev, [jobId]: "delete" }));

    const originalJobs = [...jobs];
    setJobs((prev) => prev.filter((job) => job.id !== jobId));

    try {
      await deleteJob(jobId);
      toast.success("Job deleted successfully");
    } catch (error) {
      setJobs(originalJobs);
      toast.error("Failed to delete job");
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[jobId];
        return next;
      });
    }
  };

  return {
    jobs: paginatedJobs,
    totalCount: filteredAndSortedJobs.length,
    totalJobsUnfiltered: jobs.length,
    isLoading,
    actionLoading,

    currentPage,
    totalPages,
    setCurrentPage,

    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDirection,
    handleSort,

    handleStatusToggle,
    handleDelete,
  };
};
