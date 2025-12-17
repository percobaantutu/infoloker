import React from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const RecentApplicationsTable = ({ applications = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600 font-medium">
          <tr>
            <th className="px-2 py-3">Candidate</th>
            <th className="px-2 py-3">Applied For</th>
            <th className="px-2 py-3">Date</th>
            <th className="px-2 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {applications.length > 0 ? (
            applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-2 py-4">
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
                <td className="px-2 py-4 text-gray-600 font-medium">{app.job?.title}</td>
                <td className="px-2 py-4 text-gray-500">{moment(app.createdAt).fromNow()}</td>
                <td className="px-2 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${app.status === "Accepted" ? "bg-green-100 text-green-800" : app.status === "Rejected" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}
                  >
                    {app.status}
                  </span>
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
  );
};

export default RecentApplicationsTable;
