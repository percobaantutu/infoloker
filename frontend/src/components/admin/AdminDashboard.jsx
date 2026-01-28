import React from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { useAdminDashboard } from "../../hooks/admin/useAdminDashboard";
import { Users, Briefcase, FileText, Activity, DollarSign } from "lucide-react";
import LoadingSpinner from "../../components/layout/LoadingSpinner";
import moment from "moment";
import { formatRupiah } from "../../utils/formatRupiah";
import ChartWidget from "./layout/ChartWidget";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { stats, recentUsers, isLoading } = useAdminDashboard();

  if (isLoading) return <LoadingSpinner />;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Users" 
            value={stats?.users?.total || 0} 
            icon={Users} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Active Jobs" 
            value={stats?.jobs?.active || 0} 
            icon={Briefcase} 
            color="bg-green-500" 
          />
          <StatCard 
            title="Total Applications" 
            value={stats?.applications?.total || 0} 
            icon={Activity} 
            color="bg-purple-500" 
          />
          <StatCard 
            title="Published Articles" 
            value={stats?.articles?.total || 0} 
            icon={FileText} 
            color="bg-orange-500" 
          />
          <StatCard 
            title="Total Revenue" 
            value={`Rp ${formatRupiah(String(stats?.revenue?.total || 0))}`} 
            icon={DollarSign} 
            color="bg-emerald-600" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWidget 
            title="User Growth (Last 30 Days)" 
            type="line" 
            data={stats?.charts?.userGrowth} 
            color="#215E61" 
          />
          <ChartWidget 
            title="Job Applications (Last 30 Days)" 
            type="bar" 
            data={stats?.charts?.applicationTrend} 
            color="#FE7F2D"
          />
        </div>

        <div className="w-full">
            <ChartWidget 
                title="Revenue Trend (Last 30 Days)" 
                type="line" 
                data={stats?.charts?.revenueTrend} 
                color="#059669" 
                isCurrency={true}
            />
        </div>


        {/* Recent Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Recent Registrations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${user.role === 'employer' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {moment(user.createdAt).fromNow()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;