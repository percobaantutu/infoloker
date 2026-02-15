import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Building2, ChevronLeft, ChevronRight, Briefcase, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import FeaturedBadge from "./ui/FeaturedBadge";
import PremiumBadge from "./ui/PremiumBadge";
import { getCachedData, setCachedData } from "../utils/cacheUtils";

const CACHE_KEY = "swr_carousel_jobs";

const LatestJobsCarousel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);

  // Responsive: cards visible per view
  const [cardsPerView, setCardsPerView] = useState(4);

  useEffect(() => {
    // 1. Restore cached data immediately
    const cached = getCachedData(CACHE_KEY);
    if (cached?.data?.length) {
      setJobs(cached.data);
      setLoading(false);
    }

    // 2. Fetch fresh data in background
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.JOBS.GET_ALL_JOBS);
        const latest = response.data.slice(0, 10);
        setJobs(latest);
        setCachedData(CACHE_KEY, latest);
      } catch (error) {
        console.error("Failed to fetch carousel jobs:", error);
        // If we have no cached data either, leave loading as-is
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll every 2 seconds
  useEffect(() => {
    if (isPaused || jobs.length <= cardsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, jobs.length - cardsPerView);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused, jobs.length, cardsPerView]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, jobs.length - cardsPerView);
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse flex space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 bg-gray-200 h-48 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (jobs.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('landing.latestJobs', 'Latest Jobs')}
            </h2>
            <p className="text-gray-600 mt-1">
              {t('landing.latestJobsSubtitle', 'Discover new opportunities')}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= jobs.length - cardsPerView}
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="overflow-hidden"
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            }}
          >
            {jobs.map((job) => (
              <div
                key={job._id}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / cardsPerView}%` }}
              >
                <div
                  onClick={() => handleJobClick(job._id)}
                  className={`bg-white rounded-xl border p-4 hover:shadow-lg transition-all duration-300 cursor-pointer h-full ${
                    job.isFeatured ? 'border-amber-300' : 'border-gray-100'
                  }`}
                >
                  {/* Featured Badge */}
                  {job.isFeatured && (
                    <div className="mb-3">
                      <FeaturedBadge size="sm" />
                    </div>
                  )}

                  {/* Company Logo + Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                      {job.company?.companyLogo ? (
                        <img
                          src={job.company.companyLogo}
                          alt={job.company.companyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm md:text-base">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {job.isAdminPosted ? job.adminCompanyName : (job.company?.companyName || "Company")}
                        </p>
                        {job.isAdminPosted ? (
                          <span className="inline-flex items-center px-1 py-0.5 rounded text-[9px] font-semibold bg-red-100 text-red-700 border border-red-200">
                            Admin
                          </span>
                        ) : (
                          <PremiumBadge plan={job.company?.plan} size="sm" showLabel={false} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location & Type */}
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{job.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      <span>{job.type}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: Math.max(1, jobs.length - cardsPerView + 1) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-blue-600 w-4' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Employer CTA */}
        <div className="mt-10 bg-blue-600 rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            {t('landing.ctaTitle', 'Want to post a job?')}
          </h3>
          <p className="text-blue-100 mb-4 max-w-xl mx-auto">
            {t('landing.ctaSubtitle', 'Reach thousands of qualified candidates. Create your employer account today!')}
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {t('landing.ctaButton', 'Sign Up as Employer')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestJobsCarousel;
