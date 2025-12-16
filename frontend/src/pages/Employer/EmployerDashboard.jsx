import { useEffect, useState } from "react";
import { Plus, Briefcase, Users, Building2, TrendingUp, CheckCircle2, Clock, XCircle } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/layout/Statcard";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDashboardOverview = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardOverview();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="employer-dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Fallback for counts if data is null
  const counts = dashboardData?.counts || { totalJobs: 0, totalApplications: 0, totalHired: 0 };
  const trends = dashboardData?.counts?.trends || { activeJobs: 0, totalApplicants: 0, totalHired: 0 };
  const recentApplications = dashboardData?.data?.recentApplications || [];

  return (
    <DashboardLayout activeMenu="employer-dashboard">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <button onClick={() => navigate("/post-job")} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Post New Job
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Active Jobs" value={counts.totalJobs} icon={Briefcase} color="bg-blue-500" trend={trends.activeJobs} />
          <StatCard title="Total Applications" value={counts.totalApplications} icon={Users} color="bg-purple-500" trend={trends.totalApplicants} />
          <StatCard title="Hired Candidates" value={counts.totalHired} icon={CheckCircle2} color="bg-green-500" trend={trends.totalHired} />
        </div>

        {/* Recent Applications Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
            <button onClick={() => navigate("/applicants")} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-3">Candidate</th>
                  <th className="px-6 py-3">Applied For</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {app.applicant?.avatar ? <img src={app.applicant.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-gray-500">{app.applicant?.name?.charAt(0)}</span>}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{app.applicant?.name}</p>
                            <p className="text-xs text-gray-500">{app.applicant?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{app.job?.title}</td>
                      <td className="px-6 py-4 text-gray-500">{moment(app.createdAt).fromNow()}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${app.status === "Accepted" ? "bg-green-100 text-green-800" : app.status === "Rejected" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/applicants/${app._id}`)} // Or verify your route path
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No applications received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
