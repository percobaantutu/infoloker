import { Search } from "lucide-react";

const JobFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }) => {
  return (
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
    </div>
  );
};

export default JobFilters;
