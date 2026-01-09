import React from "react";
import moment from "moment";
import { Mail, Calendar, FileText, Briefcase, User } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import StatusSelect from "./StatusSelect";

const AllApplicantsTable = ({ applications, updatingStatusId, onStatusUpdate }) => {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <p className="font-medium text-gray-900">No applications found</p>
        <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or wait for candidates to apply</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">Candidate</TableHead>
              <TableHead className="px-6 py-4">Job Applied For</TableHead>
              <TableHead className="px-6 py-4">Contact</TableHead>
              <TableHead className="px-6 py-4">Applied Date</TableHead>
              <TableHead className="px-6 py-4">Resume</TableHead>
              <TableHead className="px-6 py-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app._id}>
                {/* Candidate */}
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 overflow-hidden">
                      {app.applicant?.avatar ? <img src={app.applicant.avatar} alt={app.applicant?.name} className="w-full h-full object-cover" /> : <span>{app.applicant?.name?.charAt(0).toUpperCase()}</span>}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{app.applicant?.name}</p>
                      <p className="text-xs text-gray-500">ID: {app.applicant?._id?.slice(-6)}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Job Title */}
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700">{app.job?.title}</span>
                  </div>
                </TableCell>

                {/* Contact */}
                <TableCell className="px-6 py-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate max-w-[200px]">{app.applicant?.email}</span>
                  </div>
                </TableCell>

                {/* Date */}
                <TableCell className="px-6 py-4 text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {moment(app.createdAt).format("MMM DD, YYYY")}
                  </div>
                </TableCell>

                {/* Resume */}
                <TableCell className="px-6 py-4">
                  {app.resume ? (
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                      View Resume
                    </a>
                  ) : (
                    <span className="text-gray-400 italic text-sm">No resume</span>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell className="px-6 py-4">
                  <StatusSelect currentStatus={app.status} onChange={(newVal) => onStatusUpdate(app._id, newVal)} isLoading={updatingStatusId === app._id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllApplicantsTable;
