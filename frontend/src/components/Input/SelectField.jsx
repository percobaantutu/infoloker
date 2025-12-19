import { AlertCircle } from "lucide-react";

const SelectField = ({ id, label, name, value, onChange, options = [], error, placeholder, icon: Icon, required = false, disabled = false }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
            <Icon className="h-5 w-5" />
          </div>
        )}

        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full ${Icon ? "pl-10" : "pl-3"} pr-10 py-2.5 border rounded-lg text-base transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-500 ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          } focus:outline-none focus:ring-2 focus:ring-opacity-50 appearance-none bg-white`}
        >
          <option value="">{placeholder || "Select an option"}</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="space-x-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectField;
