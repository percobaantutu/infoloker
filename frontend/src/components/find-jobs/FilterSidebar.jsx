import React from "react";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import { formatRupiah } from "../../utils/formatRupiah";
import LocationSelect from "../Input/LocationSelect";
import { useTranslation } from "react-i18next";

const FilterSidebar = ({ filters, setFilters, onCloseMobile }) => {
  const { t } = useTranslation();
  
  const handleFilterChange = (key, value) => {
    const newValue = filters[key] === value ? "" : value;
    setFilters({ ...filters, [key]: newValue });
  };

  const handleSalaryChange = (e, field) => {
    const val = e.target.value.replace(/\D/g, "");
    setFilters({ ...filters, [field]: val });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900">{t('filter.filters')}</h3>
        <button 
            onClick={() => {
                setFilters({ keyword: filters.keyword, location: filters.location, category: "", type: "", salaryMin: "", salaryMax: "" });
                if (onCloseMobile) onCloseMobile();
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
            {t('filter.clearAll')}
        </button>
      </div>

      <LocationSelect
        value={filters.location}
        onChange={(value) => setFilters({ ...filters, location: value })}
        placeholder={t('filter.locationPlaceholder')}
        className="mb-8"
      />

      {/* Salary Range */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">{t('filter.salaryRange')}</h4>
        <div className="space-y-3">
            <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-xs">Rp</span>
                <input 
                    type="text" 
                    placeholder={t('job.salaryMin')}
                    value={formatRupiah(filters.salaryMin)}
                    onChange={(e) => handleSalaryChange(e, "salaryMin")}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                />
            </div>
            <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-xs">Rp</span>
                <input 
                    type="text" 
                    placeholder={t('job.salaryMax')}
                    value={formatRupiah(filters.salaryMax)}
                    onChange={(e) => handleSalaryChange(e, "salaryMax")}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                />
            </div>
        </div>
      </div>

      {/* Job Type */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">{t('filter.jobType')}</h4>
        <div className="space-y-3">
          {JOB_TYPES.map((type) => (
            <label key={type.value} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="jobType"
                checked={filters.type === type.value}
                onChange={() => handleFilterChange("type", type.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                {/* Translates label if it is a key, or renders text */}
                {t(type.label)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">{t('filter.categories')}</h4>
        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <label key={cat.value} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.value}
                onChange={() => handleFilterChange("category", cat.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                {/* This constructs keys like 'categories.Engineering' */}
                {t(`categories.${cat.value}`)}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Mobile only: Close Button */}
      {onCloseMobile && (
        <button 
            onClick={onCloseMobile}
            className="mt-8 w-full py-3 bg-blue-600 text-white rounded-xl font-medium"
        >
            {t('filter.showResults')}
        </button>
      )}
    </div>
  );
};

export default FilterSidebar;