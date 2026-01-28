import React from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { useAdminFinance } from "../../hooks/admin/useAdminFinance";
import { DollarSign, CreditCard, Search } from "lucide-react";
import LoadingSpinner from "../../components/layout/LoadingSpinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { formatRupiah } from "../../utils/formatRupiah";
import moment from "moment";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const SubscriptionManagement = () => {
  const { subscriptions, stats, isLoading, filters, setFilters } = useAdminFinance();

  if (isLoading && subscriptions.length === 0) return <LoadingSpinner />;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Revenue & Subscriptions</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={`Rp ${formatRupiah(String(stats.totalRevenue))}`} 
            icon={DollarSign} 
            color="bg-green-600" 
          />
          <StatCard 
            title="Active Subscriptions" 
            value={stats.totalActiveSubs} 
            icon={CreditCard} 
            color="bg-blue-600" 
          />
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Order ID..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-4">Order ID</TableHead>
                <TableHead className="px-6 py-4">User</TableHead>
                <TableHead className="px-6 py-4">Plan</TableHead>
                <TableHead className="px-6 py-4">Amount</TableHead>
                <TableHead className="px-6 py-4">Date</TableHead>
                <TableHead className="px-6 py-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub._id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 font-mono text-xs text-gray-500">
                    {sub.orderId}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="font-medium text-gray-900">{sub.user?.name}</div>
                    <div className="text-xs text-gray-500">{sub.user?.email}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 capitalize">{sub.planType}</TableCell>
                  <TableCell className="px-6 py-4 font-medium">
                    Rp {formatRupiah(String(sub.amount))}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-500">
                    {moment(sub.createdAt).format("MMM D, HH:mm")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                      sub.status === 'active' ? 'bg-green-100 text-green-700' :
                      sub.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {sub.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SubscriptionManagement;