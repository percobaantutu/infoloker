import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Building2, 
  CheckCircle, 
  ArrowLeft, 
  Share2, 
  Heart 
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LoadingSpinner from "../../components/layout/LoadingSpinner";
import { formatRupiah } from "../../utils/formatRupiah";
import { useJobDetails } from "../../hooks/useJobDetails";

const JobDetails = () => {
  const navigate = useNavigate();
  const { 
    job, 
    loading, 
    error, 
    hasApplied, 
    isSaved, 
    isApplying, 
    applyToJob, 
    toggleSave,
    user 
  } = useJobDetails();

  if (loading) return <LoadingSpinner />;

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-500 mb-6">This job posting may have been removed or closed.</p>
            <button 
              onClick={() => navigate("/find-jobs")}
              className="text-blue-600 font-medium hover:underline"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?._id === job.company?._id;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Job Header Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden shrink-0">
                      {job.company?.companyLogo ? (
                        <img src={job.company.companyLogo} alt={job.company.companyName} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                      <div className="flex items-center text-gray-500 mt-1 font-medium">
                        {job.company?.companyName || "Confidential Company"}
                        <span className="mx-2">•</span>
                        <span className="text-blue-600">{job.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Share/Save Actions (Desktop) */}
                  <div className="hidden sm:flex gap-2">
                    <button 
                      onClick={() => toggleSave()}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isSaved 
                          ? "bg-red-50 border-red-100 text-red-500" 
                          : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                    <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                    {job.type}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700">
                    <MapPin className="w-3.5 h-3.5 mr-1.5" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
                    <DollarSign className="w-3.5 h-3.5 mr-1.5" />
                    {formatRupiah(String(job.salaryMin))} - {formatRupiah(String(job.salaryMax))}
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
                <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                  {job.description}
                </div>
              </div>

              {/* Requirements Section */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Requirements</h2>
                <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                  {job.requirements}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Sidebar (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                
                {/* 1. Action Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-1">Interested in this job?</h3>
                  <p className="text-sm text-gray-500 mb-6">Review the requirements carefully before applying.</p>
                  
                  {isOwner ? (
                    <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-200">
                      <p className="text-sm font-medium text-gray-600">You posted this job</p>
                      <button 
                        onClick={() => navigate(`/edit-job/${job._id}`)}
                        className="mt-2 text-blue-600 text-sm font-medium hover:underline"
                      >
                        Edit Job
                      </button>
                    </div>
                  ) : hasApplied ? (
                    <div className="w-full py-3 bg-green-50 text-green-700 font-medium rounded-xl flex items-center justify-center border border-green-100">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Applied
                    </div>
                  ) : (
                    <button 
                      onClick={applyToJob}
                      disabled={isApplying}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isApplying ? "Applying..." : "Apply Now"}
                    </button>
                  )}

                  <p className="text-xs text-center text-gray-400 mt-4">
                    Posted {moment(job.createdAt).fromNow()}
                  </p>
                </div>

                {/* 2. Job Overview Details */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Job Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                        <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500">Date Posted</p>
                            <p className="text-sm font-medium text-gray-900">{moment(job.createdAt).format("MMMM Do, YYYY")}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Briefcase className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500">Job Type</p>
                            <p className="text-sm font-medium text-gray-900">{job.type}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <DollarSign className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500">Salary</p>
                            <p className="text-sm font-medium text-gray-900">
                                {formatRupiah(String(job.salaryMin))} - {formatRupiah(String(job.salaryMax))}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Building2 className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                            <p className="text-xs text-gray-500">Category</p>
                            <p className="text-sm font-medium text-gray-900">{job.category}</p>
                        </div>
                    </div>
                  </div>
                </div>

                {/* 3. Company Mini Profile */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 overflow-hidden">
                            {job.company?.companyLogo ? (
                                <img src={job.company.companyLogo} alt="" className="w-full h-full object-cover"/>
                            ) : (
                                <Building2 className="w-5 h-5 text-gray-400"/>
                            )}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">{job.company?.companyName}</h4>
                            <p className="text-xs text-gray-500">Hiring Company</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                        {job.company?.companyDescription || "No description available for this company."}
                    </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};


const CalendarIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

export default JobDetails;