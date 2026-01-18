import { useState, useEffect, useRef } from "react";
import { MapPin, ChevronDown, X, Search } from "lucide-react";
import { searchCities, MAJOR_CITIES } from "../../utils/indonesiaCities";
import { useTranslation } from "react-i18next";

const LocationSelect = ({ 
  value, 
  onChange, 
  error, 
  placeholder, 
  label,       
  required = false,
  showMajorCities = true
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value || "");
  const [filteredCities, setFilteredCities] = useState([]);
  const dropdownRef = useRef(null);


  const finalPlaceholder = placeholder || t('location.searchPlaceholder');
  const finalLabel = label === undefined ? t('job.location') : label;

  useEffect(() => {
    if (value !== search) {
      setSearch(value || "");
    }
  }, [value]);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredCities(showMajorCities ? MAJOR_CITIES : []);
    } else {
      const results = searchCities(search, 50);
      setFilteredCities(results);
    }
  }, [search, showMajorCities]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    onChange(city.value);
    setSearch(city.value);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearch("");
    setFilteredCities(showMajorCities ? MAJOR_CITIES : []);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearch(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      {finalLabel && (
        <label className="block text-sm font-medium text-gray-700">
          {finalLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Input Field */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
          <input
            type="text"
            value={search}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={finalPlaceholder}
            className={`w-full pl-10 pr-20 py-2.5 border rounded-lg text-base transition-colors bg-white ${
              error 
                ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
          />
          
          {/* Right Icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-10">
            {search && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`} 
            />
          </div>
        </div>

        {/* Dropdown List */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
            {/* Header */}
            {!search && showMajorCities && (
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  {t('location.popularCities')}
                </p>
              </div>
            )}
            
            {/* List Container */}
            <div className="max-h-72 overflow-y-auto">
              {filteredCities.length > 0 ? (
                <ul className="py-1">
                  {filteredCities.map((city, index) => (
                    <li
                      key={`${city.value}-${index}`}
                      onClick={() => handleSelect(city)}
                      className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
                        <MapPin className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {city.value}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{city.province}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-12 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {t('location.noCitiesFound')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('location.tryDifferentKeyword')}
                  </p>
                </div>
              )}
            </div>

            {/* Footer - Show count */}
            {filteredCities.length > 0 && search && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {t('location.showingResults', { count: filteredCities.length })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="text-red-500">⚠</span>
          {error}
        </p>
      )}
      
      {/* Helper Text */}
      {!error && !search && (
        <p className="text-xs text-gray-500">
          {t('location.typeToSearch')}
        </p>
      )}
    </div>
  );
};

export default LocationSelect;