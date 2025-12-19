import { X, MapPin, Briefcase, DollarSign } from "lucide-react";
import { formatRupiah } from "../../utils/formatRupiah";

const JobPostingPreview = ({ data, onClose }) => {
  if (!data) return null;

  const { jobTitle, location, category, jobType, description, requirements, salaryMin, salaryMax } = data;

  const requirementList = requirements
    ?.split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Job Preview</h2>
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
            <X className="h-4 w-4" />
            Back to Edit
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto max-h-[80vh]">
          {/* Job Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{jobTitle || "Job Title"}</h1>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {location || "Location"}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">{category || "Category"}</span>
              <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">{jobType || "Job Type"}</span>
              <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Posted today</span>
            </div>
          </div>

          {/* Compensation */}
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 text-white p-2 rounded-lg">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Compensation</p>
                <p className="font-semibold text-gray-900">
                  Rp {formatRupiah(salaryMin)} – {formatRupiah(salaryMax)} per year
                </p>
              </div>
            </div>
            <span className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">Competitive</span>
          </div>

          {/* About */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Role</h3>
            <div className="bg-gray-50 border rounded-xl p-4 text-sm text-gray-700 leading-relaxed">{description || "No description provided."}</div>
          </section>

          {/* Requirements */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What We’re Looking For</h3>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">{requirementList?.length ? requirementList.map((item, index) => <li key={index}>{item}</li>) : <li>No requirements provided.</li>}</ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default JobPostingPreview;
