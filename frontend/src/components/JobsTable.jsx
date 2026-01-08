import { ChevronDown, ChevronUp } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";
import JobRow from "./JobRow";
import LoadingRow from "./layout/LoadingRow";

const SortIcon = ({ active, direction }) => {
  if (!active) return <ChevronUp className="w-4 h-4 text-gray-400" />;
  return direction === "asc" ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-blue-600" />;
};

const JobsTable = ({ jobs, isLoading, sortField, sortDirection, onSort, onStatusToggle, onDelete }) => {
  const renderSortHeader = (label, field) => (
    <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onSort(field)}>
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <SortIcon active={sortField === field} direction={sortDirection} />
      </div>
    </TableHead>
  );

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            <TableRow>
              {renderSortHeader("Job Title", "title")}
              {renderSortHeader("Status", "status")}
              {renderSortHeader("Applicants", "applicants")}
              <TableHead className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <LoadingRow key={i} />)
            ) : jobs.length > 0 ? (
              jobs.map((job) => <JobRow key={job.id} job={job} onStatusToggle={onStatusToggle} onDelete={onDelete} />)
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  No jobs found matching your criteria.
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default JobsTable;
