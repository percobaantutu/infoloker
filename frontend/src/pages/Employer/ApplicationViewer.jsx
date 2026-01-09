import React from "react";
import { ArrowLeft, Mail, FileText, Calendar, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusSelect from "../../components/StatusSelect";
import { useApplicationViewer } from "../../hooks/useApplicationViewer";

const ApplicationViewer = () => {
  const navigate = useNavigate();
  const { applicants, jobDetails, isLoading, updateStatus, updatingStatusId } = useApplicationViewer();

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="manage-jobs">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="manage-jobs">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button onClick={() => navigate("/manage-jobs")} className="flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Applicants for <span className="text-blue-600">{jobDetails?.title || "Job"}</span>
                </h1>
                <p className="text-gray-500 mt-1">Total Applicants: {applicants.length}</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4">Resume</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applicants.length > 0 ? (
                    applicants.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                              {app.applicant?.avatar ? <img src={app.applicant.avatar} alt="" className="w-full h-full object-cover rounded-full" /> : app.applicant?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{app.applicant?.name}</p>
                              <p className="text-xs text-gray-500">ID: {app.applicant?._id?.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-600">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {app.applicant?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {moment(app.createdAt).format("MMM DD, YYYY")}
                          </div>
                        </td>
                        <td className="px-6 py-4">
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
                            <span className="text-gray-400 italic">No resume</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <StatusSelect currentStatus={app.status} onChange={(newVal) => updateStatus(app._id, newVal)} isLoading={updatingStatusId === app._id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500 bg-white">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <FileText className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="font-medium text-gray-900">No applicants yet</p>
                          <p className="text-sm text-gray-500 mt-1">Check back later or promote your job posting.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationViewer;
