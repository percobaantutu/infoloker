import React from "react";
import { FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LoadingSpinner from "../../components/layout/LoadingSpinner";
import ApplicationCard from "../../components/cards/ApplicationCard";
import { useMyApplications } from "../../hooks/useMyApplications";

const MyApplications = () => {
  const { applications, isLoading, error } = useMyApplications();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-500 mt-1">Track the status of your job applications.</p>
          </div>

          {/* Content */}
          {isLoading ? (
            <LoadingSpinner />
          ) : applications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app) => (
                <ApplicationCard key={app._id} application={app} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                You haven't applied to any jobs yet. Start exploring opportunities and finding your dream career.
              </p>
              <Link 
                to="/find-jobs"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Find Jobs
                <Search className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyApplications;