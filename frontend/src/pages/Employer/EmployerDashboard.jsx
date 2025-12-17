import { useEffect, useState } from "react";
import { Plus, Briefcase, Users, Building2, TrendingUp, CheckCircle2, Clock, XCircle } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/layout/Statcard";
import LoadingSpinner from "../../components/layout/LoadingSpinner";
import JobDashboardCard from "../../components/layout/JobDashboardCard";
import Card from "../../components/Card";
import ApplicantDashboardCard from "../../components/layout/ApplicantDashboardCard";
import RecentApplicationsTable from "../../components/layout/RecentApplicationsTable";
import QuickActions from "../../components/layout/QuickActions";

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
        <LoadingSpinner />
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
          <StatCard
            bg={"bg-gradient-to-br from-blue-500 to-blue-600 text-white"}
            title="Total Active Jobs"
            value={counts.totalJobs}
            icon={Briefcase}
            color=""
            trend={trends.activeJobs}
            trendValue={`${dashboardData?.counts?.trends?.activeJobs || 0}%`}
          />
          <StatCard
            bg={"bg-gradient-to-br from-violet-500 to-violet-600 text-white"}
            title="Total Applications"
            value={counts.totalApplications}
            icon={Users}
            color="green"
            trend={trends.totalApplicants}
            trendValue={`${dashboardData?.counts?.trends?.totalApplicants}`}
          />
          <StatCard bg={"bg-gradient-to-br from-emerald-500 to-emerald-500 text-white"} title="Hired Candidates" value={counts.totalHired} icon={CheckCircle2} trend={trends.totalHired} />
        </div>

        {/* Recent Applications Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card
            title="Recent Job Posts"
            subtitle="Your latest job postings"
            headerAction={
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium" onClick={() => navigate("/manage-jobs")}>
                View all
              </button>
            }
          >
            <div className="space-y-3">
              {dashboardData?.data?.recentJobs?.slice(0, 3)?.map((job, index) => (
                <JobDashboardCard key={index} job={job} />
              ))}
            </div>
          </Card>
          <Card
            title="Recent Applications"
            subtitle="Latest candidates who applied"
            headerAction={
              <button onClick={() => navigate("/applicants")} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            }
            // Optional: You can remove padding from the card body for tables to go edge-to-edge
            className="overflow-hidden"
          >
            <RecentApplicationsTable applications={recentApplications} />
          </Card>
        </div>
        {/* <Card title="Quick Actions" subtitle="Common tasks to get you started">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Post New Job",
                icon: Plus,
                color: "bg-blue-50 text-blue-700",
                path: "/post-job",
              },
              {
                title: "Review Applications",
                icon: Users,
                color: "bg-green-50 text-green-700",
                path: "/manage-jobs",
              },
              {
                title: "Company Settings",
                icon: Building2,
                color: "bg-orange-50 text-orange-700",
                path: "/company-profile",
              },
            ].map((action, index) => (
              <button key={index} onClick={() => navigate(action.path)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition hover:cursor-pointer">
                <div className={`p-2 rounded-lg  ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-800">{action.title}</span>
              </button>
            ))}
          </div>
        </Card> */}
        <QuickActions />
      </div>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
