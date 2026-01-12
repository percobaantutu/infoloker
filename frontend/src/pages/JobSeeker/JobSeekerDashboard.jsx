import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JobSearchHeader from "../../components/find-jobs/JobSearchHeader";
import FilterSidebar from "../../components/find-jobs/FilterSidebar";
import JobCard from "../../components/cards/JobCard";
import LoadingSpinner from "../../components/layout/LoadingSpinner";
import { useFindJobs } from "../../hooks/useFindJobs";

const JobSeekerDashboard = () => {
  const { jobs, isLoading, error, filters, setFilters, toggleSaveJob } = useFindJobs();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Find Your Dream Job</h1>
            <p className="text-gray-500 mt-1">Browse thousands of job openings to find the perfect fit.</p>
        </div>

        {/* Search Bar */}
        <JobSearchHeader filters={filters} setFilters={setFilters} />

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
            <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl text-gray-700 font-medium shadow-sm active:bg-gray-50"
            >
                <Filter className="w-4 h-4" />
                Filters
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Desktop Filters (Hidden on Mobile) */}
            <div className="hidden lg:block lg:col-span-1 sticky top-24">
                <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>

            {/* Job List */}
            <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 font-medium">
                        Showing <span className="font-bold text-gray-900">{jobs.length}</span> jobs
                    </p>
                </div>

                {isLoading ? (
                    <LoadingSpinner />
                ) : jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {jobs.map((job) => (
                            <JobCard key={job._id} job={job} onToggleSave={toggleSaveJob} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
            
            {/* Slide-up Drawer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-10">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4 pb-8">
                    <FilterSidebar 
                        filters={filters} 
                        setFilters={setFilters} 
                        onCloseMobile={() => setIsMobileFilterOpen(false)}
                    />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default JobSeekerDashboard;